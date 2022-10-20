const re = arg => {
    const regex = /^[A-Za-z ']+$/;
    const val = arg.target.value
    if(!val.match(regex)){
      arg.target.value = val.split('').filter(a => a.match(regex)).join('')
    }
} 

const roomRegex = arg => {
    const regex = /^[1-6]+$/;
    const val = arg.target.value
    if(!val.match(regex)){
      arg.target.value = val.split('').filter(a => a.match(regex)).join('')
    }
  }
  const roomKvRegex = arg => {
    const regex = /^[30-70]+$/;
    const val = arg.target.value
    if(!val.match(regex)){
      arg.target.value = val.split('').filter(a => a.match(regex)).join('')
    }
  }

  const roomKvSumRegex = arg => {
    const regex = /^[0-9]+$/;
    const val = arg.target.value
    if(!val.match(regex)){  
      arg.target.value = val.split('').filter(a => a.match(regex)).join('')
    } 
  }

  const setCookie = (key,arg) =>{
     document.cookie = `${key}=${arg}`;
  }
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  function removeCookie(name) {
    document.cookie = `${name}=;`
  }


  export { 
    re,
    roomKvRegex,
    roomKvSumRegex,
    roomRegex,
    removeCookie,
    getCookie,
    setCookie
  }