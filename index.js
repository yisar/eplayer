import Eplayer from './src/eplayer'

let video = document.getElementById('player')
new Eplayer(video, {
  src:
    'https://lhmts.vips100.com/201809150108/e2b7df621c6b83f64e8b7897c111cf5f/983080cbed4cd433ad4f3bfecc316f90_480.mp4'
})
