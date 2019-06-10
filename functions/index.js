'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const TAXONOMY_COLLECTION = db.collection('taxonomy');
const QUESTION_COLLECTION = db.collection('questions');

exports.questionChange = functions.firestore.document('questions/{questionID}').onWrite(
    async (change, context) => {

        const oldQuestion = change.before.data(),
            newQuestion = change.after.data();

        let oldTopic,
            oldTopicRef,
            newTopic,
            newTopicRef;

        /* Load variables */
        if (change.before.exists) {
            oldTopic = oldQuestion.topic;
            oldTopicRef = TAXONOMY_COLLECTION.doc(oldTopic);
        }

        if (change.after.exists) {
            newTopic = newQuestion.topic;
            newTopicRef = TAXONOMY_COLLECTION.doc(newTopic);
        }

        if (!change.before.exists) {
            // New document Created : plus one to counter.total

            const newTopicData = await newTopicRef.get().then(snap => snap.data());

            return newTopicRef.set({
                counter: {
                    total: newTopicData.counter.total + 1
                }
            }, {
                    merge: true
                });
        }

        if (!change.after.exists) {
            // Deleting question : subtract one from counter.total and counter.hidden if the question was hidden

            let wasHidden = false;

            if (oldQuestion.status === 0) {
                wasHidden = true;
            }

            const oldTopicData = await oldTopicRef.get().then(snap => snap.data());

            return oldTopicRef.set({
                counter: {
                    hidden: oldTopicData.counter.hidden + (wasHidden ? -1 : 0),
                    total: oldTopicData.counter.total - 1
                }
            }, {
                    merge: true
                });
        }

        if (change.before.exists && change.after.exists) {
            // Updating existing document
            // Two Cases:
            // 1. Question was moved from one topic to another
            // 2. Changed visibility

            if (oldTopic !== newTopic) { /* Case 1 */

                /// Subtract one from old topic counter.total

                const oldTopicData = await oldTopicRef.get().then(snap => snap.data()),
                    newTopicData = await newTopicRef.get().then(snap => snap.data());

                oldTopicRef.set({
                    counter: {
                        total: oldTopicData.counter.total - 1
                    }
                }, {
                        merge: true
                    });

                if (oldQuestion.hidden === true) {
                    /// Subtract one from old topic count.hidden if that question was hidden
                    oldTopicRef.set({
                        counter: {
                            hidden: oldTopicData.counter.hidden - 1
                        }
                    }, {
                            merge: true
                        });
                }

                /// Plus one to new topic counter.total
                newTopicRef.set({
                    counter: {
                        total: newTopicData.counter.total + 1
                    }
                }, {
                        merge: true
                    });

                if (newQuestion.hidden === true) {
                    /// Plus one to new topic counter.hidden if that question is hidden
                    return newTopicRef.set({
                        counter: {
                            hidden: newTopicData.counter.hidden + 1
                        }
                    }, {
                            merge: true
                        });
                } else {
                    return true;
                }
            } else if (oldQuestion.hidden !== newQuestion.hidden) { /* Case 2 */
				/*
					If isHidden is true, that means the question **was** visible. 
				*/

                const isHidden = newQuestion.hidden;

                const newTopicData = await newTopicRef.get().then(snap => snap.data());

                return newTopicRef.set({
                    counter: {
                        hidden: newTopicData.counter.hidden + (isHidden ? 1 : -1)
                    }
                }, {
                        merge: true
                    });
            }
        }

        return 0;
    });

/* HTTP Function to initialize/reset question counter manually */

const express = require('express');
const cors = require('cors')({
    origin: true
});
const app = express();
app.use(cors);

app.get('/', async (req, res) => {
    const topicID = req.query.topic,
        topicRef = TAXONOMY_COLLECTION.doc(topicID);

    if (!topicID) {
        res.send("Topic ID is required");
        return;
    }

    const allQuestions = await QUESTION_COLLECTION.where('topic', '==', topicID).get();

    let totalCount = allQuestions.size,
        hiddenCount = 0;

    allQuestions.forEach(async item => {
        /*
            0: Hidden
            1: Visible
        */

        if (item.data().status === 0) {
            hiddenCount++;
        }

        await topicRef.set({
            counter: {
                total: totalCount,
                hidden: hiddenCount
            }
        }, {
                merge: true
            });

        res.json({
            total: totalCount,
            hidden: hiddenCount
        });
    })
});

exports.reCount = functions.https.onRequest(app);