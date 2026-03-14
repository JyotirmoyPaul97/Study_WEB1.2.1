const firebaseConfig = {

apiKey: "YOUR_API_KEY",

authDomain: "YOUR_DOMAIN",

projectId: "YOUR_PROJECT_ID",

storageBucket: "YOUR_BUCKET"

};


firebase.initializeApp(firebaseConfig);


const db = firebase.firestore();

const storage = firebase.storage();



async function postContent(){


let title = document.getElementById("title").value

let content = document.getElementById("content").value

let category = document.getElementById("category").value


let file = document.getElementById("pdfUpload").files[0]

let pdfURL = ""


if(file){

let storageRef = storage.ref("pdfs/"+file.name)

await storageRef.put(file)

pdfURL = await storageRef.getDownloadURL()

}


db.collection("posts").add({

title:title,

content:content,

category:category,

pdf:pdfURL,

upvotes:0,

time:Date.now()

})


}



function loadPosts(){


db.collection("posts")

.orderBy("time","desc")

.onSnapshot(snapshot=>{


let posts = document.getElementById("posts")

posts.innerHTML=""


snapshot.forEach(doc=>{


let data = doc.data()


posts.innerHTML += `

<div class="card">

<h3>${data.title}</h3>

<p>${data.content}</p>

<p><b>${data.category}</b></p>

${data.pdf ? `<a href="${data.pdf}" target="_blank">📄 View PDF</a>` : ""}

<div class="upvote" onclick="upvote('${doc.id}')">

👍 ${data.upvotes}

</div>

</div>

`

})


})

}



function upvote(id){

let ref = db.collection("posts").doc(id)

ref.update({

upvotes: firebase.firestore.FieldValue.increment(1)

})

}



function searchPosts(){

let input = document.getElementById("searchBar").value.toLowerCase()

let cards = document.querySelectorAll(".card")


cards.forEach(card=>{

let text = card.innerText.toLowerCase()

card.style.display = text.includes(input) ? "block" : "none"

})

}


loadPosts()