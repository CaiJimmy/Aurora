import { Firestore } from '@/firebase/firestore';
import Vue from 'vue';
import Console from '@/utils/Console';

const topicPageModule = (topicId, topicData) => {
    return {
        namespaced: true,
        state () {
            return {
                questions: [],  /* Old questions (existed before page loaded) are  stored here */
                paginate: ['questions'],  /* Vue-Paginate config */
                paging: {
                    question_per_page: 20,   /* Number of questions per page */
                    loaded: []   /* Loaded pages, to avoid querying data again */
                },
                ref: {
                    questions: null
                },
                topicId: topicId,
                topicData: topicData
            }
        },
        mutations: {
            setQuestion (state, payload) {
                Vue.set(state.questions, payload._index, {
                    loading: false,
                    ...payload.questionData
                });
            },
            addLoadedPage (state, pageNumber) {
                Vue.set(state.paging, 'loaded', state.paging.loaded.concat(pageNumber))
            },
            setValue (state, payload) {
                Vue.set(state, payload.key, payload.value);
            }
        },
        actions: {
            async handleQuestions ({ commit, dispatch }, payload) {
                /*
                    Fetch questions of given reference
                    And if user is admin, query userdata of each question (Check /methods/fetchUserDatas.js)
                */
                return new Promise((resolve) => {
                    Console.log('Questions reference: ', payload.ref);

                    payload.ref.get().then((documentSnapshots) => {
                        let _questions = [],
                            _index = payload.index || 0;

                        Console.log('Questions document snapshots: ', documentSnapshots);

                        documentSnapshots.forEach((doc) => {
                            let questionData = doc.data();
                            questionData.id = doc.id;
                            _questions.push(questionData);
                            commit('setQuestion', {
                                _index: _index,
                                questionData: questionData,
                            });
                            _index++;

                            dispatch('users/requestUser', questionData.author, { root: true });
                        });

                        resolve(documentSnapshots);
                    });
                });
            },
            async onPageChange ({
                state,
                commit,
                dispatch
            }, payload) {
                const currentPage = payload.toPage,
                    per_page = state.paging.question_per_page;

                let startAfter = null,
                    limit = per_page,
                    index = per_page * (currentPage - 1),   /* Start after the question before that page */
                    startAfterAvailable;

                if (state.paging.loaded.includes(currentPage)) {
                    return;
                }

                /* Display progress spinner */
                const questionBefore = state.questions[index - 1];
                if (questionBefore && !questionBefore.loading) {
                    /* 
                        If the question before that page is loaded, 
                        we can build it's documentSnapshot to query the following page only
                    */
                    const questionBeforeRef = Firestore.collection('questions').doc(questionBefore.id),
                        questionBeforeSnapshot = await questionBeforeRef.get();
                    startAfter = state.ref.questions.startAfter(questionBeforeSnapshot).limit(per_page);

                    if (index < 0) {
                        index = 0;
                    }

                    startAfterAvailable = true;
                }
                else {
                    /* 
                        But if it's not loaded, we'll have to request all questions between first page and current page
                    */
                    limit = currentPage * per_page;   /* Load all question from first page to current page */
                    if (limit <= 0) {
                        /* 
                            Limit can not be less or equal to zero
                            This happend when currentPage == 0 
                        */
                        limit = per_page;
                    }

                    startAfter = state.ref.questions.limit(limit);
                    index = 0;   /* Start loop from first page */
                    startAfterAvailable = false;
                }

                Console.log('Question request limit: ', limit);
                Console.log('Start at index: ', index);

                dispatch('handleQuestions', {
                    ref: startAfter,
                    index: index
                }).then(() => {
                    if (startAfterAvailable) {
                        /*  startAfterAvailable = true
                                => Only requested current page 
                            Add current page to paging.loaded to avoid requesting the data again
                        */

                        commit('addLoadedPage', currentPage);
                    }
                    else {
                        /* 
                            Request from 0 to current page 
                            Add those pages to paging.loaded 
                        */

                        commit('addLoadedPage', Array.from(Array(currentPage).keys()));
                    }
                })
            },
            async init ({
                state,
                commit,
                dispatch
            }) {
                /// Initialize Firestore references and laod the first page
                /// This action should be only called once, after module registration

                const counter = state.topicData.counter;

                if (this.isAdmin) {
                    /* 
                        Hidden questions are visible to admins
                    */
                    /* Fill array with placeholders, to build pagination */
                    commit('setValue', {
                        key: 'questions',
                        value: new Array(counter.total).fill({
                            loading: true
                        })
                    })

                    commit('setValue', {
                        key: 'ref',
                        value: {
                            questions: Firestore.collection('questions')
                                .where('topic', '==', state.topicId)
                                .orderBy("date", 'desc')
                        }
                    })
                }
                else {
                    /*
                        For students, they can not see hidden questions
                    */
                    commit('setValue', {
                        key: 'questions',
                        value: new Array(counter.total - counter.hidden).fill({
                            loading: true
                        })
                    });

                    commit('setValue', {
                        key: 'ref',
                        value: {
                            questions: Firestore.collection('questions')
                                .where('topic', '==', state.topicId)
                                .where('status', '==', 1)
                                .orderBy("date", 'desc')
                        }
                    })
                }

                /// Load first page
                dispatch('onPageChange', {
                    toPage: 0
                })
            }
        }
    }
}

export default topicPageModule;