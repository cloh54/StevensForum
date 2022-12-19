//const { createComment } = require("./data/comments");
const { createPost, addCommentToPost, addLike, addDislike } = require("./data/posts");
const { createUser, getUserById } = require("./data/users");
const { createReport } = require("./data/reports");

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
        let studC = await createUser('muffin_man', 'password', false);
        let studD = await createUser('davidism', 'password', false);
        let studE = await createUser('kyle_f', 'password', false);
        let studF = await createUser('maybell', 'password', false);
        let studG = await createUser('bamboo', 'password', false);
        let studH = await createUser('hamster_lover', 'password', false);
        let studI = await createUser('steph_p', 'password', false);
        let studJ = await createUser('monica_gellar', 'password', false);
       
        let postA = await createPost(studA._id.toString(), studA.username, 'About the final', 'Does anyone know if the CS final will be in person or online?', 'cs');
        await addCommentToPost(studB._id.toString(), studB.username, postA._id.toString(), 'I think that the professor said it would be in person');
        await addLike(postA._id.toString(), studA._id.toString());
        await addLike(postA._id.toString(), studB._id.toString());
        await addLike(postA._id.toString(), studH._id.toString());
        await addLike(postA._id.toString(), studG._id.toString());

        let postB = await createPost(studB._id.toString(), studB.username, 'How can I remove a specific item from an array?', 'How do I remove a specific value from an array? Something like: array.remove(value); I have to use core JavaScript. Frameworks are not allowed.', 'javascript, arrays');
        await addCommentToPost(studA._id.toString(), studA.username, postB._id.toString(), 'You can user array.splice()');
        await addCommentToPost(studC._id.toString(), studC.username, postB._id.toString(), 'Find the index of the array element you want to remove using indexOf, and then remove that index with splice.');
        await addLike(postB._id.toString(), studC._id.toString());

        let postC = await createPost(studC._id.toString(), studC.username, 'CS485-C essay', 'What topic did people choose to write about for the 4th essay in section c?', 'cs485');
        await addCommentToPost(studB._id.toString(), studB.username, postC._id.toString(), 'I wrote about fbi hacking computers.');
        await addCommentToPost(studD._id.toString(), studD.username, postC._id.toString(), "I did week 12's reading on the impact of automation");
        await addCommentToPost(studI._id.toString(), studI.username, postC._id.toString(), 'My essay was on mass surveillance.');
        await addLike(postC._id.toString(), studC._id.toString());
        await addLike(postC._id.toString(), studB._id.toString());
        await addLike(postC._id.toString(), studI._id.toString());

        let postD = await createPost(studD._id.toString(), studD.username, 'Good humanities', 'Does anyone have any good humanities recommendations?', 'humanity, humanities');
        await addCommentToPost(studH._id.toString(), studH.username, postD._id.toString(), "HHS-135 is an easy one");
        await addCommentToPost(studE._id.toString(), studE.username, postD._id.toString(), "Psychology is an interesting class!");
        await addCommentToPost(studJ._id.toString(), studJ.username, postD._id.toString(), "I took sociology last semester and the teacher is really cool.");
        await addLike(postD._id.toString(), studJ._id.toString());
        await addLike(postD._id.toString(), studE._id.toString());

        let postE = await createPost(studE._id.toString(), studE.username, 'Undo a commit in git', "I accidentally committed the wrong files to Git, but didn't push the commit to the server yet. How do I undo those commits from the local repository?", "git, undo, git-commit");
        await addCommentToPost(studF._id.toString(), studF.username, postE._id.toString(), "git reset is the command responsible for the undo. It will undo your last commit while leaving your working tree (the state of your files on disk) untouched. You'll need to add them again before you can commit them again).");
        await addLike(postE._id.toString(), studF._id.toString());

        let postF = await createPost(studF._id.toString(), studF.username, "Senior Design groups", "I am a junior and I am curious on how senior design is gonna be like next year. Do you get to pick your groups? What are you working on?", 'cs, senior, design, senior-design');
        await addCommentToPost(studA._id.toString(), studA.username, postF._id.toString(), "It depends what major you are in I heard. I am a cs major. We had to pick our own groups. There are companies who pitch projects to us and we have to email the project holders to be assigned to their project. Its pretty chill as long as you meet and work with your group regularly.");
        await addCommentToPost(studF._id.toString(), studF.username, postF._id.toString(), "Thank you BigLearner, I'm also a cs major so your comment really helped!");
        await addLike(postF._id.toString(), studF._id.toString());
        await addLike(postF._id.toString(), studA._id.toString());

        let postG = await createPost(studG._id.toString(), studF.username, "PEP115 Final", "To pep115 students, how are you studying for the final?", "pep115, pep, final, study");
        await addCommentToPost(studI._id.toString(), studI.username, postG._id.toString(), "I am going over all the lecture slides");
        await addCommentToPost(studC._id.toString(), studC.username, postG._id.toString(), "Just gonna wing it");
        await addCommentToPost(studD._id.toString(), studD.username, postG._id.toString(), "There is gonna be a study group later tonight! Everyone should come");
        await addLike(postG._id.toString(), studD._id.toString());
        await addLike(postG._id.toString(), studI._id.toString());

        let postH = await createPost(studH._id.toString(), studH.username, "After CS546", "Whats the class code for web programming 2?", "cs546, web, web-programming");
        await addCommentToPost(studE._id.toString(), studE.username, postH._id.toString(), "CS554");
        await addLike(postH._id.toString(), studE._id.toString());

        let postI = await createPost(studI._id.toString(), studI.username, "AHHHHHH", "AHHHASuhcISIUEDIPUEDH", "");
        await addDislike(postI._id.toString(), studF._id.toString());
        await addDislike(postI._id.toString(), studA._id.toString());
        await addDislike(postI._id.toString(), studC._id.toString());
        await createReport(postI._id.toString(), "This post is useless");

        let postJ = await createPost(studJ._id.toString(), studJ.username, "Merge conflicts in git", "How do I resolve merge conflicts in my Git repository?", "git, git-merge, merge, conflict, merge-conflict");
        await addCommentToPost(studG._id.toString(), studG.username, postJ._id.toString(), "Try git mergetool. It opens a GUI that steps you through each conflict, and you get to choose how to merge. Sometimes it requires a bit of hand editing afterwards, but usually it's enough by itself. It is much better than doing the whole thing by hand certainly.");
        await addDislike(postJ._id.toString(), studH._id.toString());

        console.log("Seeded!");
        client.close();
    
    }
    catch (err) {
        console.log(err.stack);
    }
}

seedDB();