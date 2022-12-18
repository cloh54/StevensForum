//const { createComment } = require("./data/comments");
const { createPost, addCommentToPost } = require("./data/posts");
const { createUser, getUserById } = require("./data/users");

const MongoClient = require("mongodb").MongoClient;

async function seedDB(){
    const uri = "mongodb://localhost:27017/";
    const client = new MongoClient(uri , {
        useNewUrlParser: true
    });
    try {
        await client.connect();
        console.log("seeding...");

        const userCollection = client.db("cs546_final_proj").collection("users");
        const postsCollection = client.db("cs546_final_proj").collection("posts");
        const commentsCollection = client.db("cs546_final_proj").collection("comments");
    
        
        userCollection.deleteMany({});
        postsCollection.deleteMany({});
        commentsCollection.deleteMany({});
        
       
        let prof = await createUser('DrProfessor', '00000000', true);
        let studA = await createUser('BigLearner', '11223344', false);
        let studB = await createUser('GoodGrades', '44332211', false);
       
        let postA = await createPost(studA._id.toString(), studA.username, 'About the final', 'Does anyone know if the CS final will be in person or online?', 'CS');
        studcomment = await addCommentToPost(studB._id.toString(), studB.username, postA._id.toString(), 'I think that the professor said it would be in person');
        
        
        console.log("Seeded!");
        client.close();
    
    }
    catch (err) {
        console.log(err.stack);
    }
}

seedDB();