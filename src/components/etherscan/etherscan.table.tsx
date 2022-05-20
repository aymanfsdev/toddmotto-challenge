import { useEffect, useState } from "react"
import { fetchBlockLength, fetchDetail } from "../fetch/fetch.detail"
import BigNumber from 'bignumber.js';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import { toast } from "../toast/ToastManager";

let blockstore:number = 0; 
let selectState:boolean=false;

export default function EtherscanTable() {
  let trx: any = [{}];
  
  const [transactions, setState] = useState([{}]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(0);  
  const [nextpagenum, setNextNum] = useState(0);

  useEffect(() => {

      let blockbypage:any;
      let data = setInterval(async () => {
      let len = await fetchBlockLength();
      console.log('len='+Number(len)+'blockstore='+Number(blockstore))  ;
      if(Number(len) > Number(blockstore)&&Number(blockstore)>0&&selectState==false){                
        window.scroll({
          top : 0,
          behavior:"smooth",          
        })                
        toast.show({
          title:'New Alarm',
          content:'New transaction occured!',
          duration:3000
        })
      }
      
      blockstore = len;
      blockbypage = Math.floor(Number((len/10).toFixed(0)))+1;
      selectState = false;
      setPageLimit(blockbypage);
      
      trx = await fetchDetail(currentPage);
      setState(trx);
    }, 3000);
    return () => clearInterval(data);
  }, [currentPage])


  function secondsToDhms(seconds : number) :any {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    
    var dDisplay = d > 0 ? d + " D " : "";
    var hDisplay = h > 0 ? h + " H " : "";
    var mDisplay = m > 0 ? m + " M " : "";    
    return dDisplay + hDisplay + mDisplay;
    }

  function getTimestamp(time: any) : any {
    let startDate = new Date(Number(time)*1000);
    let date1: Date = new Date();
    let date2: Date = new Date(startDate);

    let timeInMilisec: number = date1.getTime() - date2.getTime();        
    let age = secondsToDhms(timeInMilisec/1000);

    const string1 = age.slice(0, 15);    
    
    return string1;
  }

  function getRewards(value: string): any {
    let val = new BigNumber(value);
    let decimal = new BigNumber(1000000000000000000);
    val = val.dividedBy(decimal);

    return (val.toNumber().toFixed(0)).toString();
  }

  function NewTab(contractaddress:any) { 
    window.open("https://ropsten.etherscan.io/tx/"+contractaddress);      
}

  const filterData = (filter:any) => {
    const filtered = transactions.filter((data:any) => data.from.includes(filter));
    setState(filtered);
  }


  return (
    <div>
      <div className="flex flex-col mt-6">
        <div className="center mb-3">
          <input className="search" onChange={ (e:any) => filterData(e.tartget.value) } />
        </div>        
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                     <th
                      scope="col"
                      className="px-6 py-3 text-xs text-table-head text-gray-500 uppercase tracking-wider"
                      >
                      Age
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs text-table-head text-gray-500 uppercase tracking-wider"
                    >
                      From
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs text-table-head text-gray-500 uppercase tracking-wider"
                    >
                      To
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs text-table-head text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs text-table-head text-gray-500 uppercase tracking-wider"
                    >
                      Reward
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs text-table-head text-gray-500 uppercase tracking-wider"
                    >
                      View Trx
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.slice(0).map((transaction: any,index:number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-table-body text-gray-900">{ getTimestamp(transaction.timeStamp) }</div>                        
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-table-body text-gray-900">{transaction.from}</div>                        
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-table-body text-gray-900"><a href={`https://ropsten.etherscan.io/address/${transaction.to}`}>{transaction.to}</a></div>                         
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-green-800 ${transaction.confirmations != 0 ? 'bg-green-100' : 'bg-red-200'}`}>
                          {transaction.comfirmations != 0 ? "success" : "error"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-table-body text-gray-500">{getRewards(transaction.value)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a href="">                        
                        <input type="button" className="view_trx text-indigo-600 hover:text-indigo-900"  onClick={ () => NewTab(transaction.hash)} id="trx_id" value="View Trx"  />                                      
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <a
                    href="#"
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </a>
                  <a
                    href="#"
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Next
                  </a>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">                  
                  <div></div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <a
                        href="#"
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        onClick={ ()=>{ if(currentPage%5==0){setNextNum(nextpagenum-5);} currentPage>1?setCurrentPage(currentPage-1):setCurrentPage(currentPage) }  }  
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                      </a>

                      {

                        Array.apply(0, Array(pageLimit<=5?pageLimit:5)).map(function (x: any, i: any) {
                          return (
                            <a
                              href="#"
                              aria-current="page"
                              className={`z-10 relative inline-flex items-center px-4 py-2 border text-sm font-medium ${ currentPage==i+1+nextpagenum?'active_page':'' }`}
                              key={i+nextpagenum}
                              onClick={()=>{ setCurrentPage(i+1+nextpagenum)} }
                            >
                              {i+1+nextpagenum}
                            </a>
                          )
                        })}
                      <a
                        href="#"
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        onClick={ ()=>{ if(currentPage%5==0){setNextNum(nextpagenum+5);} setCurrentPage(currentPage+1) } }
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                      </a>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>

  )
}