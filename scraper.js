// include all libraries
let fs=require("fs");
let request=require("request");
let cheerio=require("cheerio");
const { jsPDF } = require("jspdf");
let $;
let data={};
request("https://github.com/topics",function(err,res,body) {
    if(err) return console.log(err);
    $=cheerio.load(body);

    // allgithubAnchors -> give the link of all topics on sending request to  https://github.com/topics.
    
    let allgithubAnchors=$('.no-underline.d-flex.flex-column.flex-justify-center');
    let allgithubTopicNames=$('.f3.lh-condensed.text-center.Link--primary.mb-0.mt-1');

    // Traverse all the topic on github topic page and find each Topicurl and TopicName and invoked function getallProjectoftopic//
     for(let i=0;i<allgithubAnchors.length;i++){
        
         let githubTopicName=$(allgithubTopicNames[i]).text().trim();
         let githubTopiclink="https://github.com"+$(allgithubAnchors[i]).attr("href");
         fs.mkdirSync(githubTopicName);
        getallProjectofTopic(githubTopicName,githubTopiclink);
     }
})

// getallProjectofTopic -> This function basically find first 8 project of particular github Topic:
function getallProjectofTopic(Topicname,Topicurl) {
   
    request(Topicurl,function(err,req,body){
        if(err)  return console.log(err);
         $=cheerio.load(body);
         let allprojects=$('.f3.color-text-secondary.text-normal.lh-condensed .text-bold');
         if(allprojects.length > 8){
            allprojects=allprojects.slice(0,8);
         }
        /* Traverse through all the projects and find each project name and project title of particular topic and invoked function 
          getallIssues to find all the current issues of that project*/
         for(x of allprojects){
            let projectName=$(x).text().trim();
            let projecturl="https://github.com"+$(x).attr("href");
               if(!data[Topicname]){
                   data[Topicname]=[{projectName,projecturl}];
               }else{
                   data[Topicname].push({projectName,projecturl});
               }

               getallIssues(projectName,projecturl,Topicname);
          }
          
    })
}

// get all Isssues -> This function basically give all the issues of a particular project
function getallIssues(projectName,projecturl,Topicname){
 request(projecturl+"/issues",function(err,req,body){
     if(err) return console.log(err);
      $=cheerio.load(body);
      let allIssues=$(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title");
       /* Traverse through all the issues and find each IssueTitle and Issueurl */
        for(x of allIssues){
            let IssueTitle=$(x).text().trim();
            let Issueurl="https://github.com"+ $(x).attr("href");
            let idx=data[Topicname].findIndex(function(e){
                return e.projectName==projectName;
            })
            if(!data[Topicname][idx]["issues"]){
                data[Topicname][idx]["issues"]=[{IssueTitle,Issueurl}];
            }else{
                data[Topicname][idx]["issues"].push({IssueTitle,Issueurl});
            }
        }
        
        pdfGenerator();
 })
}
// function to generate pdf  -> module used jspdf
function pdfGenerator() {
    for (x in data) {
      let tArr = data[x];
      for (y in tArr) {
        let pName = tArr[y].projectName;
        if (fs.existsSync(`${x}/${pName}.pdf`))
        fs.unlinkSync(`${x}/${pName}.pdf`);
        const doc = new jsPDF();
        for (z in tArr[y].issues) {
          doc.text(tArr[y].issues[z].IssueTitle, 10, 10 + 15 * z);
          doc.text(tArr[y].issues[z].Issueurl, 10, 15 + 15 * z);
        }
        doc.save(`${x}/${pName}.pdf`);
      }
    }
}

