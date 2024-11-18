import { defineStore } from 'pinia'
export const useAccountStore = defineStore('account', {
    state:()=>{
        return{
            role:0
        }
    }
})