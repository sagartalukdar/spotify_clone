console.log("k");

let current_song=new Audio();  
let allsong;
let curr_folder;

// get song function  ------- >>
async function getSongs(folder){
    curr_folder=folder;
    let a=await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response=await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    allsong=[];
    for(let i=0;i<as.length;i++){
        const ele=as[i];
        if(ele.href.endsWith(".mp3")){
            allsong.push(ele.href.split(`/${folder}/`)[1]);
        }
    }
    // console.log(songs);
    let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML="";
    for(const song of allsong){
      songul.innerHTML=songul.innerHTML+
      `
      <li>
      <i class="fa-solid fa-headphones"></i>
      <div class="info ">
          <div> ${song.replaceAll("%20"," ")} </div>
          <div>Artist Name</div>
      </div>
      <div class="playnow ">
          <div>Play Now</div>
      <i class="fa-solid fa-circle-play"></i>
      </div>
      </li>
      
      `;
    }


      Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",ele=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML); 
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
      
      })  

      // return allsong;=====================================
}
// get song function  ------- >>

// second to minute-second converter function  ------- >>
function convertSecondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      return "00:00";
    }
  
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds =Math.floor( seconds % 60);
  
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
    return `${formattedMinutes}:${formattedSeconds}`;
} 
// second to minute-second converter function  ------- >>


// playmusic  function  ------- >>
const playmusic=(a,pause=false)=>{
    current_song.src=`/${curr_folder}/`+a;
    if(!pause){
    current_song.play();
    music.src="play.svg";
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(a.split("-")[0]);
    document.querySelector(".songtime").innerHTML="";
   
}
// playmusic converter function  ------- >>

// main function  ------- >>

// displayAllAlbum function  ------- >>
async function displayAllAlbum(){
  let a=await fetch(`http://127.0.0.1:5500/song/`);
  let response=await a.text();
  let div=document.createElement("div");
  div.innerHTML=response;
  let as=div.getElementsByTagName("a");

  let cardcontainer=document.querySelector(".cardcontainer");
  let arr=Array.from(as);
  for(let i=0;i<arr.length;i++){
    const e=arr[i];

    if(e.href.includes("/song/")){
      console.log(e.href.split("/").slice(-1)[0]);
      let folder=e.href.split("/").slice(-1)[0];
      let a=await fetch(`http://127.0.0.1:5500/song/${folder}/info.json`);
      let response=await a.json();
      console.log(response);
      cardcontainer.innerHTML=cardcontainer.innerHTML+
      `<div data-folder="${folder}" class="card ">
      <div class="play">
          <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" class="Svg-sc-ytk21e-0 iYxpxA" width="40" height="40">
              <!-- Circle background -->
              <circle cx="12" cy="12" r="11" fill="green" />
            
              <!-- Pause icon (white triangle) indicating muted state -->
              <polygon points="9,6 9,18 16,12" fill="white" />
          </svg>
         
        </div>
      <img src="/song/${folder}/d4.jpeg" alt="" class="rounded">
      <h4>${response.title}</h4>
      <p>${response.description}</p>
      </div>`;
    }

  }
  

  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
      // console.log(item.currentTarget.dataset.folder);
      await getSongs(`song/${item.currentTarget.dataset.folder}`);
      playmusic(allsong[0]);
    })
  })


}
// displayAllAlbum function  ------- >>


async function main(){

await getSongs("song/cs");
playmusic(allsong[0],true)

displayAllAlbum();

  music.addEventListener("click",()=>{
    if(current_song.paused){
        current_song.play();
        music.src="play.svg";
     
    }else{
        current_song.pause();
        music.src="pause.svg";
    }
  })

  current_song.addEventListener("timeupdate",()=>{
    console.log(current_song.currentTime,current_song.duration);
    document.querySelector(".songtime").innerHTML=`${convertSecondsToMinutesSeconds(current_song.currentTime)}/${convertSecondsToMinutesSeconds(current_song.duration)}`;
    document.querySelector(".circle").style.left=(current_song.currentTime/current_song.duration)*100+"%";

  })

  document.querySelector(".seekbar").addEventListener("click",e=>{
    // console.log((e.offsetX/e.target.getBoundingClientRect().width)*100+"%");
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left=percent+"%";
    current_song.currentTime=(current_song.duration*percent)/100;
  })

  document.querySelector(".hambarger").addEventListener("click",()=>{
    document.querySelector(".left").style.left=0;
  })
  document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-100%";
  })

  document.querySelector("#previous").addEventListener("click",()=>{
    console.log(current_song.src.split("/").slice(-1)[0]);
    // console.log(allsong);
    let index=allsong.indexOf(current_song.src.split("/").slice(-1)[0]);
    if(index-1>=0){
      playmusic(allsong[index-1])
    }
  })
  document.querySelector("#next").addEventListener("click",()=>{
    console.log("next");
    let index= allsong.indexOf(current_song.src.split("/").slice(-1)[0]);
    if(index+1<allsong.length){
      playmusic(allsong[index+1])
    }
  
  }) 

  document.querySelector(".vol-range").addEventListener("change",e=>{
    // console.log(e.target,e.target.value);
    current_song.volume=parseInt(e.target.value)/100;
    if(current_song.volume>0){
      document.querySelector(".volume>img").src="volume.svg";
    }else{
      document.querySelector(".volume>img").src="mute.svg";
    }
  })

  document.querySelector(".volume>img").addEventListener("click",e=>{
    console.log(e.target)
    if(e.target.src.includes("volume.svg")){
       e.target.src="mute.svg";
       current_song.volume=0;
       document.querySelector(".volume>input").value=0;
    }else{
      e.target.src="volume.svg";
      current_song.volume=0.20;
      document.querySelector(".volume>input").value=20;
    }
   
  })


}
// main function  ------- >>



main();
