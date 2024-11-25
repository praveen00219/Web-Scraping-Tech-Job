const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const xlsx = require('xlsx');

// axios.get('https://www.timesjobs.com/candidate/job-search.html?searchType=Home_Search&from=submit&asKey=OFF&txtKeywords=&cboPresFuncArea=35',{
//     headers: {
//         "content-type": 'text/html',
//     }
// }).then((data)=>{
//     // console.log(data.data);
//     fs.writeFile('data.txt', data.data, (er)=>{
//         if(er) {
//             console.log(er);
//             return;
//         }
//         else {
//             console.log('File saved successfully');
//         }   
//     });
// }).catch((err)=>{
//     console.log(err);
    
// })

const jobsData = [];

fs.readFile('data.txt', 'utf-8', (er,data)=>{
    if(er) {
        console.log(er);
        return;
    }
    else {
        const $ = cheerio.load(data);
        const card = $('.clearfix.job-bx.wht-shd-bx');
        $(card).each((i,item)=>{
            const jobTitle = $(item).find('.heading-trun>a').text().split('\t').join('').split('\n').join('').trim();
            // console.log(jobTitle);
            const jobDesc = $(item).find('.job-description__').text().split('\t').join('').split('\n').join('').trim();
            const skills = [];
            $(item).find('.more-skills-sections>span').each((i,item)=>{
                skills.push($(item).text().split('\t').join('').split('\n').join('').trim());
            })
            const companyName = $(item).find('.joblist-comp-name').text().split('\t').join('').split('\n').join('').trim();
            const location = $(item).find('.srp-zindex.location-tru').text().split('\t').join('').split('\n').join('').trim();
            // const jobtType = $(item).find('.joblist-comp-jobtype').text().split('\t').join('').split('\n').join('').trim();
            const postedDate = $(item).find('.sim-posted>span').text().split('\t').join('').split('\n').join('').trim();
            
            const job = {
                title: jobTitle,
                description: jobDesc,
                skills: skills.join('\t'),
                company: companyName,
                location: location,
                // jobType: jobtType,
                postedDate: postedDate
            }
            console.log(job);
            
            jobsData.push(job);
            fs.appendFile('details.txt', `\n${i+1} Job-Title: ${jobTitle}\n \tJob-description: ${jobDesc}\n \tSkills: ${skills.join('\t')}\n\n \tCompany Name: ${companyName}\n\n \tLocation: ${location}\n\n \tPosted Date: ${postedDate}\n\n`, (err)=>{
                if(er) {
                    console.log(er);
                    return;
                }
                else {
                    console.log('Details saved successfully');
                }
            })
        })
    }
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(jobsData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'JobsData.xlsx');
    xlsx.writeFile(workbook, 'JobsData.xlsx');
})


