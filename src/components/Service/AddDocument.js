import firebase, { db } from "../firebase/config";
export const addDocument = (collection, data) => {

  const query = db.collection(collection);

  query.add({
    ...data,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

export const deleteDocument = (collection, docId) => {

  if (!db) {
    alert("Cơ sở dữ liệu Firestore chưa được khởi tạo.");
    return;
  }

  const query = db.collection(collection).where('createdAt', '==', docId).limit(1);

  query
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log("Không tìm thấy tài liệu phù hợp.");
        return;
      }

      const doc = querySnapshot.docs[0];
      const docRef = db.collection(collection).doc(doc.id);

      docRef
        .delete()
        .then(() => {
          // alert("Bản ghi đã được xóa thành công!");
        })
        .catch((error) => {
        });
    })
    .catch((error) => {
    });
};

// tao keywords cho displayName, su dung cho search
export const generateKeywords = (displayName) => {
  // liet ke tat cac hoan vi. vd: name = ["David", "Van", "Teo"]
  // => ["David", "Van", "Teo"], ["David", "Teo", "Van"], ["Teo", "David", "Van"],...
  const name = displayName.split(' ').filter((word) => word);

  const length = name.length;
  let flagArray = [];
  let result = [];
  let stringArray = [];

  for (let i = 0; i < length; i++) {
    flagArray[i] = false;
  }

  const createKeywords = (name) => {
    const arrName = [];
    let curName = '';
    name.split('').forEach((letter) => {
      curName += letter;
      arrName.push(curName);
    });
    return arrName;
  };

  function findPermutation(k) {
    for (let i = 0; i < length; i++) {
      if (!flagArray[i]) {
        flagArray[i] = true;
        result[k] = name[i];

        if (k === length - 1) {
          stringArray.push(result.join(' '));
        }

        findPermutation(k + 1);
        flagArray[i] = false;
      }
    }
  }

  findPermutation(0);

  const keywords = stringArray.reduce((acc, cur) => {
    const words = createKeywords(cur);
    return [...acc, ...words];
  }, []);

  return keywords;
};