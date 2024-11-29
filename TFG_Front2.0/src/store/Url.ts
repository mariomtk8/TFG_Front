import { reactive } from 'vue'

interface UrlState {
  baseUrl: string
}

const state: UrlState = reactive({
  baseUrl: 'http://a4f3d54b75e49485791db4994f42a014-387405513.us-east-1.elb.amazonaws.com'
  //a4f3d54b75e49485791db4994f42a014-387405513.us-east-1.elb.amazonaws.com
  //http://localhost:5023
})

export default state