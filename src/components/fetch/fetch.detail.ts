import axios from 'axios'
const apikey = process.env.REACT_APP_APIKEY;
const address = process.env.REACT_APP_ADDRESS;
const contractaddress = process.env.REACT_APP_CONTRACTADDRESS;


export const fetchDetail = async(current_page:number) => {
    
    let transaction_data:any;        
    const page = 10*(current_page-1);
    const limit = page+9;
    try {
        let res : any;                            
            res = await axios.get(`https://api-ropsten.etherscan.io/api?module=account&action=tokentx&contractaddress`+contractaddress+`&address=`+address+`&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=`+apikey+``).then((d:any)=>{    

            transaction_data = d.data.result;           
            console.log(transaction_data);
        });
        
        return transaction_data.reverse().slice(page, limit);        
        
    } catch (error) {
    }

}


export const fetchBlockLength = async() => {
    let block_length:any;    
    try {
        let res : any;        
        res = await axios.get(`https://api-ropsten.etherscan.io/api?module=account&action=tokentx&contractaddress`+contractaddress+`&address=`+address+`&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=`+apikey+``).then((d:any)=>{                       
            block_length = d.data.result.length;
            
        });
        return block_length;
    } catch (error) {        
    }
}