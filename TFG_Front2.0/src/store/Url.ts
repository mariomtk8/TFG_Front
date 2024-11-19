import { reactive } from 'vue'

interface UrlState {
  baseUrl: string
}

const state: UrlState = reactive({
  baseUrl: 'http://localhost:5023'
  //http://a7bf6533c051941e3b7a87053c11b42b-1321297782.us-east-1.elb.amazonaws.com
})

export default state