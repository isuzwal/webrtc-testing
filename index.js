let stream = null;
let Stream=1
let isMuted = false;
let isCameraOff = false;
let pc; 

// const localVideo = document.getElementById('localVideo');
// const remoteContainer = document.getElementById('remoteContainer');
// const startBtn = document.getElementById('startBtn');
// const cameraBtn = document.getElementById('cameraBtn');
// const endBtn = document.getElementById('endBtn');
// const status = document.getElementById('status');
// const videoGrid = document.getElementById('videoGrid');

const micBtn = document.getElementById("micBtn");
const onMic = document.getElementById("micBtnOn");

// for micOff
const micOff = () => {
  try {
    if (!stream) return;
    stream.getAudioTracks()[0].enabled = false;
  } catch (err) {
    console.log("Error", err);
  }
};
// for the micOn
const micON = () => {
    try {
        if (!stream) return;
        stream.getAudioTracks()[0].enabled = true;
    } catch (err) {
        console.log("Error", err);
    }
};
micBtn.addEventListener("click", micOff);
onMic.addEventListener("click", micON);
// this for  get the permission form the use tio get acess of the camer and mic
const startcalling = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const remoteVideo = document.getElementById("remoteVideo");
    // Attach live stream
    remoteVideo.srcObject = stream; // stream object
  } catch (error) {
    console.error("Error accessing media devices.", error);
  }
};

startcalling();
// crating the vdieo call offer 

document.getElementById("createOfferBtn").onclick=async()=>{
    pc=new RTCPeerConnection() // build the new connection
                       // for each of the track of the media [MediaStreamTrack(audio), MediaStreamTrack(video)]
    stream.getTracks().forEach(t => pc.addTrack(t,stream));
    /* this line code it do 
     think as the postman where  he need to have leave the letter to other mailbox 
     there postman is  pc and bag od postman is addtrack  and mailbox is  ontrack
    */ 
   pc.ontrack=(event)=>{
    remoteVideo.srcObject=event.streams[0]

}
pc.onicecandidate=(event)=>{
    console.log("Address of it ",event.candidate)
    if(event.candidate) return // when it null do not do anything
    document.getElementById("offer").value = JSON.stringify(pc.localDescription);
}
const offer =await pc.createOffer();
await pc.setLocalDescription(offer)

}


createAnswerBtn.onclick = async () => {
  pc = new RTCPeerConnection();
  stream.getTracks().forEach(track => pc.addTrack(track, stream));

  pc.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) return;
    document.getElementById("answer").value = JSON.stringify(pc.localDescription);
  };

  const offer = JSON.parse(document.getElementById("offer").value);
  await pc.setRemoteDescription(offer);

  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
};
setAnswerBtn.onclick = async () => {
  const answer = JSON.parse(document.getElementById("answer").value);
  await pc.setRemoteDescription(answer);
};