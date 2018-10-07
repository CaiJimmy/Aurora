export default function firestoreSearch(firestoreRef, field, strSearch) {
    const strLength = strSearch.length,
        strFrontCode = strSearch.slice(0, strLength - 1),
        strEndCode = strSearch.slice(strLength - 1, strSearch.length);

    const startcode = strSearch,
        endcode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);

    return firestoreRef.where(field, '>=', startcode)
        .where(field, '<', endcode);
}