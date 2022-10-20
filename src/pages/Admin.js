import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "../components/header/Header";
import TabsUnstyled from '@mui/base/TabsUnstyled';
import {  Button, Card, CardActions, CardContent, CardMedia,  Typography } from "@mui/material";
import { useQuery, useMutation } from '@apollo/client'
import { Context } from "../context/Context";
import {re,roomKvRegex,roomKvSumRegex,roomRegex,removeCookie,getCookie,setCookie} from '../utils/functions'
import { Tab, TabPanel, TabsList} from '../utils/styles'
import {schema, editSchema, editMortgageValidateSchema, mortgageValidateSchema, editBankValidateSchema, bankValidateSchema} from '../utils/validate';
import Joi  from "joi-browser";
import {DELETE_COMPLEX, DELETE_COMPANY, POST_COMPLEX, PUT_COMPLEX, GET_COMPLEX, POST_BANK, PUT_BANK, GET_BANK, GET_COMPANY, DELETE_BANK} from '../utils/graphql'



const Admin = () =>{
      const {chunkSubstr} = useContext(Context)
    
      const [toggle, setToggle] = React.useState({
        display: false,
        edit: false,
        editId: 0
      })
      const [complexToggle, setComplexToggle] = React.useState({
        display: false,
        edit: false,
        editId: 0
      });
      const [bankToggle, setBankToggle] = React.useState({
        display: false,
        edit: false,
        editId: 0
      });
      const [comp, setComp] = useState({loaded: false, data:{}});
      const [mortgage, setMortgage] = useState([0])

      const complexname = useRef();
      const complexaddress = useRef();
      const complexroom = useRef();
      const complexroomkv = useRef();
      const complexroomkvsum = useRef();
      const complexcompanyid = useRef();
      const bankname = useRef();
      const bankaddress = useRef();

      useEffect(() =>{
        if(complexToggle.display){
          fetch('http://localhost:9000/company')
          .then(res => res.json())
          .then(data => setComp({loaded: true, data: data.data}))
          .catch(() => setComp({loaded:false, data: false}))
        }
      }, [complexToggle])
    
      useEffect(()=>{
        if(!bankToggle.display){
          removeCookie('bankaddress')
          removeCookie('bankname')
          for(let i =0; i<3; i++){
            removeCookie(`suminput${i}`)
            removeCookie(`selectinput${i}`)
          }
          mortgage.splice(1,2);
          setMortgage([...mortgage])
         }
      }, [bankToggle])

      const closeForm = () =>{
        setToggle({
          display:false
        })
        window.location.reload(true)
      }

      const addItem = () =>{
        if(mortgage.length<3){
          for(let i of mortgage){
            setCookie(`suminput${i}`, document.querySelector(`.suminput${i}`).value || '')
            setCookie(`selectinput${i}`, document.querySelector(`.selectinput${i}`).value || '')
          }
          mortgage.push(mortgage.length)
          setMortgage([...mortgage])
          setCookie('bankname', bankname.current.value)
          setCookie('bankaddress', bankaddress.current.value)
        }
      }

      // Kompaniyani crud kodlari
      const addCompany = e =>{
        e.preventDefault();
        let formdata = new FormData();
        const pic = document.querySelector('.img');
        const {name} = e.target;
        formdata.append('company-pic', pic.files[0]);
        formdata.append('name', name.value)

        fetch('http://localhost:9000/company',{
            method:'POST',
            body: formdata
        })
        .then(res => res.json())
        .then(() => closeForm())
        .catch(err => alert(err))
      }
      const [delCompany ] = useMutation(DELETE_COMPANY)
      const deleteCompany = id =>{
        delCompany({
          variables:{
            id: id -0
          }
        })
        window.location.reload(true) 
      }

      const editCompany = e =>{
        e.preventDefault();
        let formdata = new FormData();
        const pic = document.querySelector('.img');
        const {name} = e.target;
        formdata.append('new-company-pic', pic.files[0]);
        if(name.value.length>3){
          formdata.append('name', name.value)
        }

        fetch(`http://localhost:9000/company/${toggle.editId}`,{
            method:'PUT',
            body: formdata
        })
        .then(res => res.json())
        .then(() => closeForm())
        .catch(err => alert(err))
      }

      function Company() {
        const { loading, error, data } = useQuery(GET_COMPANY);
        if (loading) return <h2 className="w-100 text-center mt-5">Yuklanmoqda ...(</h2>
        if(error) return <h2 className="w-100 text-center mt-5">Xatolik :(</h2>
        if(data) {
            return  data.company && data.company.length >0 ?(
              data.company.map((e, index) => (
                  <Card className="company" key={index} sx={{ maxWidth: 345 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={'http://localhost:9000/'+e.img}
                      alt={e.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {e.name}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" variant="contained" color="success" onClick={() => setToggle({display:true, edit:true, editId: e.id})} >Tahrirlash</Button>
                      <Button size="small" variant="contained" color="error" onClick={() => deleteCompany(e.id)} >O'chirish</Button>
                    </CardActions>
                  </Card>
              ))
            ):(
              <h2 className="w-100 text-center mt-5">Kompaniyalar hali yo'q :(</h2>
            )
        }
      }

      // Komplekslarni crud kodlari
      const [delComplex]=useMutation(DELETE_COMPLEX)
      const deleteComplex = id =>{
        delComplex({
          variables:{
            id
          }
        })
        window.location.reload(true)
      }

      const [postComplex] = useMutation(POST_COMPLEX)
      const AddComplex = () =>{
        const {error, value} = Joi.validate( {
          name: complexname.current.value,
          address: complexaddress.current.value,
          room: complexroom.current.value - 0,
          roomkv: complexroomkv.current.value- 0,
          roomkvsum: complexroomkvsum.current.value- 0,
          companyid: complexcompanyid.current.value -0
        }, schema);
        
        if(error){
          alert(`Formada xatolik ma'lumotni tekshiring`)
        }
        if(!error){
          const {name, address, room, roomkv, roomkvsum, companyid} = value;
          postComplex({ variables: {name, address, room, roomkv, roomkvsum, companyid}})
        }
       
       window.location.reload(true)
      }

      const [putComplex] = useMutation(PUT_COMPLEX)
      const EditComplex = () =>{
        const {error, value} = Joi.validate( {
          name: complexname.current.value,
          address: complexaddress.current.value,
          room: complexroom.current.value - 0,
          roomkv: complexroomkv.current.value- 0,
          roomkvsum: complexroomkvsum.current.value- 0,
          companyid: complexcompanyid.current.value -0
        }, editSchema);
        
        if(error){
          alert(`Formada xatolik ma'lumotni tekshiring`)
        }
        if(!error){
          putComplex({
            variables:{id: complexToggle.editId-0, ...value}
          })
        }
      }

      function Complex() {
        const { loading, error, data } = useQuery(GET_COMPLEX);
        if (loading) return <h2 className="w-100 text-center mt-5">Yuklanmoqda ...(</h2>
        if(error) return <h2 className="w-100 text-center mt-5">Xatolik :(</h2>
        if(data) {
            return  data.complex && data.complex.length >0 ?(
              data.complex.map((e, index) => (
                  <Card className="company" key={index} sx={{ maxWidth: 345 }}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">Nomi: {e.name}</Typography>
                      <Typography gutterBottom variant="h6" component="div">Manzil: {e.address}</Typography>
                      <Typography gutterBottom variant="h6" component="div">Xonalar: {e.room} ta gacha</Typography>
                      <Typography gutterBottom variant="h6" component="div">1xona: {e.roomkv} kvadratdan</Typography>
                      <Typography gutterBottom variant="h6" component="div">Kvadrati: {chunkSubstr(e.roomkvsum)} so'm</Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" variant="contained" color="success" onClick={() => setComplexToggle({display:true, edit:true, editId: e.id})} >Tahrirlash</Button>
                      <Button size="small" variant="contained" color="error" onClick={() => deleteComplex(e.id)} >O'chirish</Button>
                    </CardActions>
                  </Card>
              ))
            ):(
              <h2 className="w-100 text-center mt-5">Komplekslar hali yo'q :(</h2>
            )
        }
      }

      // Bankni crud kodlari

      const [postBank] = useMutation(POST_BANK)
      const addBank = () =>{
        const {error, value} = Joi.validate({
          name: bankname.current.value,
          address: bankaddress.current.value
        }, bankValidateSchema);
        if(error){
          alert(`Bank nomi yoki manzilini xato kiritdingiz`)
        }
        const mortgageValues = [];
        for(let e of mortgage){
          if(document.querySelector(`.selectinput${e}`).value && document.querySelector(`.suminput${e}`).value-0){
            mortgageValues.push({
              year: document.querySelector(`.selectinput${e}`).value-0,
              sum: document.querySelector(`.suminput${e}`).value-0
            })
          }
        }
        if(mortgageValues.length <1){
          alert(`kredit summa yoki yilida xatoliksiz kiritilishi shart`)
        }
        for(let e of mortgageValues){
          const checkMortgage = Joi.validate({
            year: e.year,
            sum: e.sum
          }, mortgageValidateSchema);
          if(checkMortgage.error){
            alert(`kredit summa yoki yilida xatolik`);
            return
          }
        }

        if(!error && mortgageValues.length>0){
          postBank({
            variables:{
              ...value, mortgage: JSON.stringify(mortgageValues)
            }
          })
        }

        window.location.reload(true)
      }

      const [putBank] = useMutation(PUT_BANK)
      const editBank = () =>{
        const obj = {}
        const address = bankaddress.current.value;
        const name = bankname.current.value
        if(address){
          obj.address = address
        }
        if(name){
          obj.name = name
        }
        const {error} = Joi.validate(obj, editBankValidateSchema);
        if(error){
          alert(`Bank nomi yoki manzilini xato kiritdingiz`)
          return
        }
        const mortgageValues = [];
        for(let e of mortgage){
          if(document.querySelector(`.selectinput${e}`).value && document.querySelector(`.suminput${e}`).value-0){
            mortgageValues.push({
              year: document.querySelector(`.selectinput${e}`).value-0,
              sum: document.querySelector(`.suminput${e}`).value-0
            })
          }
        }
        
        for(let e of mortgageValues){
          const checkMortgage = Joi.validate({
            year: e.year,
            sum: e.sum
          }, editMortgageValidateSchema);
          if(checkMortgage.error){
            alert(`kredit summa yoki yilida xatolik`);
            return
          }
        }

        if(!error){
          const postObj = {...obj}
          if(mortgageValues.length>0){
            postObj.mortgage = JSON.stringify(mortgageValues)
          }
          putBank({
            variables:{...postObj, id: bankToggle.editId-0
            }
          })
        }

        window.location.reload(true)
      }

      function Bank() {
        const bank = useQuery(GET_BANK);
        if (bank.loading) return <h2 className="w-100 text-center mt-5">Yuklanmoqda ...(</h2>
        if(bank.error) return <h2 className="w-100 text-center mt-5">Xatolik :(</h2>
        if(bank.data) {
            return  bank.data.bank && bank.data.bank.length >0 ?(
              bank.data.bank.map((e, index) => (
                  <Card className="bank" key={index} sx={{ maxWidth: 450 }}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">Nomi: {e.name}</Typography>
                      <Typography gutterBottom variant="h6" component="div">Manzil: {e.address}</Typography>
                      {
                        e.mortgage.map((a, index) =>(
                          <Typography key={index} gutterBottom variant="h6" component="div">Kredit: {a.year + 'yilga ' +  chunkSubstr(a.sum) + `so'm`}</Typography>
                        ))
                      }
                    </CardContent>
                    <CardActions>
                      <Button size="small" variant="contained" color="success" onClick={() => setBankToggle({display:true, edit:true, editId: e.id})} >Tahrirlash</Button>
                      <Button size="small" variant="contained" color="error" onClick={() => deleteBank(e.id)} >O'chirish</Button>
                    </CardActions>
                  </Card>
              ))
            ):(
              <h2 className="w-100 text-center mt-5">Banklar hali yo'q :(</h2>
            )
        }
      }

      const [delBank] = useMutation(DELETE_BANK);
      const deleteBank = id =>{
        delBank({
          variables:{id}
        })
        window.location.reload(true)
      }


          
    return (
        <div className="container">
            <Header text='Admin' />
            <main className="main">
            <TabsUnstyled defaultValue={getCookie('tab')-0 || 0}>
                {
                   complexToggle.display || toggle.display || bankToggle.display? (
                    <></>
                   ):(
                    <TabsList>
                        <Tab onClick={() => setCookie('tab',0)} >Kompaniyalar</Tab>
                        <Tab onClick={() => setCookie('tab',1)}>Komplekslar</Tab>
                        <Tab onClick={() => setCookie('tab',2)}>Banklar</Tab>
                    </TabsList>
                   )
                }
                <TabPanel value={0}>
                    <div className="d-flex justify-content-between align-items-center">
                        <span>Kompaniyalar:</span>

                        <button onClick={() => setToggle({display:true})} className="btn btn-success">
                            + Qo'shish
                        </button>
                    </div>

                    <ol className="company__list">
                      {
                        Company()
                      }
                    </ol>

                    {
                      toggle.display ? (
                        <div className="company__modal">
                          <form onSubmit={toggle.edit ? editCompany : addCompany} className="w-50 mx-auto form"  autoComplete="off" encType="multipart/form-data" >
                              <input required={toggle.edit ? false : true} minLength={toggle.edit ? '0' : '4'} onInput={re} className="my-2 form-control" type="text" name="name" placeholder="kompaniya nomini kiriting ... "/>
                              <input required className="my-2 form-control img" type="file" name="pic"/>
                              <Button type="submit" variant="contained" color="success">{toggle.edit ? 'Tahrirlash':`+ Qo'shish`}</Button>
                              <Button variant="outlined" className="ms-3" color="error" onClick={() => setToggle({display:false})}>Yopish</Button>
                          </form>
                        </div>
                      ):(
                        <></>
                      )
                    }

                </TabPanel>
                <TabPanel value={1}>
                    <div className="d-flex justify-content-between align-items-center">
                        <span>Komplekslar: </span>

                        <button onClick={() => setComplexToggle({display:true})} className="btn btn-success">
                            + Qo'shish
                        </button>
                    </div>
                    <ol className="company__list">
                      {
                        Complex()
                      }
                    </ol>

                    {
                      complexToggle.display ? (
                        <div className="company__modal">
                          <div  className="w-50 mx-auto form">
                              <input ref={complexname}  onInput={re} maxLength='40' minLength='3' className="my-2 form-control" type="text" name="name" placeholder="kompleks nomini kiriting ... "/>
                              <input ref={complexaddress}  onInput={re} maxLength='50' minLength='3' className="my-2 form-control" type="text" name="address" placeholder="Manzilni kiriting ... "/>
                              <input ref={complexroom} onInput={roomRegex} maxLength='1' className="my-2 form-control" type="text" name="room" placeholder="Xonalar sonini kiriting ..."/>
                              <input ref={complexroomkv} onInput={roomKvRegex} maxLength='2' className="my-2 form-control" type="text" name="roomkv" placeholder="Bitta xona necha kvadrat ..."/>
                              <input ref={complexroomkvsum} onInput={roomKvSumRegex} maxLength='8' minLength='7' className="my-2 form-control" type="text" name="roomkvsum" placeholder="Kvadrati qancha sumdan ..."/>
                              <select className="form-select mb-2" ref={complexcompanyid} >
                                    {
                                      comp.loaded && comp.data && comp.data.map((e, index) =>(
                                          <option  key={index} value={e.id}>{e.name}</option>
                                        ))
                                    }
                              </select>
                              <Button type="submit" variant="contained" color="success" onClick={complexToggle.edit ? EditComplex : AddComplex} >{complexToggle.edit ? 'Tahrirlash':`+ Qo'shish`}</Button>
                              <Button variant="outlined" className="ms-3" color="error" onClick={() => setComplexToggle({display:false})}>Yopish</Button>
                          </div>
                        </div>
                      ):(
                        <></>
                      )
                    }
                </TabPanel>
                <TabPanel value={2}>
                    <div className="d-flex justify-content-between align-items-center">
                            <span>Banklar:</span>

                            <button onClick={() => setBankToggle({display:true})} className="btn btn-success">
                                + Qo'shish
                            </button>
                    </div>

                    <ol className="company__list">
                      {
                        Bank()
                      }
                    </ol>

                    {
                      bankToggle.display ? (
                        <div className="company__modal">
                          <div  className="w-50 mx-auto form">
                              <input ref={bankname} defaultValue={getCookie('bankname') ||''}  onInput={re} maxLength='40' minLength='3' className="my-2 form-control" type="text" name="name" placeholder="Bank nomini kiriting ... "/>
                              <input ref={bankaddress} defaultValue={getCookie('bankaddress') ||''}  onInput={re} maxLength='50' minLength='3' className="my-2 form-control" type="text" name="address" placeholder="Manzilni kiriting ... "/>
                              <span className="d-block text-center mb-3">Qancha muddatga va qancha summa kredit berolasiz</span>
                              
                              {
                                mortgage.map((e, index) =>(
                                  <div key={index} style={{marginTop: "-18px"}} className="input-group w-100">
                                    <label className="input-group-text">Qiymat kiriting</label>
                                    <input type="text" placeholder="Qancha summa berolasiz" onInput={roomKvSumRegex} maxLength='10' defaultValue={getCookie(`suminput${e}` || '')} className={`form-control suminput${e}`} />
                                    <select defaultValue={getCookie(`selectinput${e}` || '')} className={`form-select selectinput${e}`}>
                                      <option value="10">10 yil</option>
                                      <option value="15">15 yil</option>
                                      <option value="20">20 yil</option>
                                    </select>
                                  </div>
                                ))
                              }
                             
                              <Button type="submit" variant="contained" color="info" className="me-3" onClick={addItem} >+ Yil qo'shish</Button>
                              <Button type="submit" variant="contained" color="success" onClick={bankToggle.edit ? editBank : addBank} >{bankToggle.edit ? 'Tahrirlash':`+ Qo'shish`}</Button>
                              <Button variant="outlined" className="ms-3" color="error" onClick={() => setBankToggle({display:false})}>Yopish</Button>
                          </div>
                        </div>
                      ):(
                        <></>
                      )
                    }
                </TabPanel>
            </TabsUnstyled>
            </main>
        </div>
    )
}

export default Admin;