import React, { useContext, useEffect, useState } from "react";
import Header from "../components/header/Header";
import { Context } from "../context/Context";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MyContent from "../utils/lang";
import { useMutation, useQuery } from "@apollo/client";
import {FIND_BANK, GET_COMPANY_BY_ID, GET_COMPANY, GET_COMPLEX_BY_COMPANYID, GET_ONE_COMPLEX} from '../utils/graphql'
import { Card,  CardContent, CardMedia,  Typography } from "@mui/material";



const Home = () =>{
    const {lang, chunkSubstr,defaultLang} = useContext(Context);

    const [selectData, setSelectDAta] = useState({
        company:{
            isSelected: false,
            value:false
        },
        complex:{
            isSelected: false,
            value:false
        },
        room:{
            isSelected: false,
            value:false
        },
        calculate:{
            isSelected: false,
            value:false
        }
    })

    const [company, setCompany] = useState('');
    const [complex, setComplex] = useState("");
    const [room, setRoom] = useState('');
    const [duration, setDuration] = useState('');

    const [getComplexByCompanyId, getComplexByCompanyIdBody ] = useMutation(GET_COMPLEX_BY_COMPANYID);
    const [getSelectedComplex, getSelectedComplexBody] = useMutation(GET_ONE_COMPLEX);
    const [findBankFn, found] = useMutation(FIND_BANK);
    useEffect(() =>{
        if(selectData?.company?.isSelected){
            getComplexByCompanyId({
                variables:{
                    id: selectData.company.value
                }
            })
            if(getComplexByCompanyIdBody.error){
                window.location.reload(true)
            }
            setDuration('')
        }
        if(selectData?.complex?.isSelected){
            getSelectedComplex({
                variables:{
                    id: selectData.complex.value
                }
            });
            if(getSelectedComplexBody.error){
                window.location.reload(true)
            }
        }
        if(selectData?.calculate?.isSelected){
            findBankFn({
                variables:{
                    year: selectData.calculate.value -0,
                    sum: (getSelectedComplexBody.data.getOneComplex[0].roomkv*selectData?.room?.value) * getSelectedComplexBody.data.getOneComplex[0].roomkvsum
                }
            });
            if(found.error){
                window.location.reload(true)
            }
        }
    }, [selectData])

    const renderComplexOption = arr =>{
        return arr.map((e, index) =>(
                <MenuItem  key={index} value={e.id}>{e.name}</MenuItem>
            )
        )
    }

    const renderComplex = arr =>{
        return arr.map((e, index) => (
            <Card className="company" key={index} sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">{MyContent[lang ? lang : defaultLang].name}: {e.name}</Typography>
                <Typography gutterBottom variant="h6" component="div">{MyContent[lang ? lang : defaultLang].address}: {e.address}</Typography>
                <Typography gutterBottom variant="h6" component="div">{MyContent[lang ? lang : defaultLang].rooms}: {e.room}</Typography>
              </CardContent>
            </Card>
        ))
    }

    const renderFoundBank = obj =>{
        return <Card className="company" sx={{ maxWidth: 500, width:450 }}>
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="div">{MyContent[lang ? lang : defaultLang].name}: {obj.name}</Typography>
                    <Typography gutterBottom variant="h6" component="div">{MyContent[lang ? lang : defaultLang].address}: {obj.address}</Typography>
                    <Typography gutterBottom variant="h6" component="div">{MyContent[lang ? lang : defaultLang].summa}: {chunkSubstr(obj.mortgage.sum)}</Typography>
                    <Typography gutterBottom variant="h6" component="div">{MyContent[lang ? lang : defaultLang].permonth}: {chunkSubstr(obj.mortgage.permonth)}</Typography>
                    </CardContent>
                </Card>
    } 

    const renderRoomOption = num =>{
        return "a".repeat(num).split('').map((_, index) =>(
            <MenuItem  key={index} value={index+1}>{index+1} {MyContent[lang ? lang : defaultLang].xona}</MenuItem>
        ))
    }
    const renderRoomValue = num =>{
        return      <Card className="company" sx={{ maxWidth: 345 }}>
                    <CardContent>
                    <Typography gutterBottom variant="h6" component="div">{MyContent[lang ? lang : defaultLang].all}:  {num}  {MyContent[lang ? lang : defaultLang].xona}</Typography>
                    <Typography gutterBottom variant="h6" component="div">{MyContent[lang ? lang : defaultLang].all}:  {getSelectedComplexBody.data && getSelectedComplexBody.data.getOneComplex[0].roomkv*num} {MyContent[lang ? lang : defaultLang].kvad}</Typography>
                    <Typography gutterBottom variant="h6" component="div">{MyContent[lang ? lang : defaultLang].all}:  {getSelectedComplexBody.data && chunkSubstr((getSelectedComplexBody.data.getOneComplex[0].roomkv*num) * getSelectedComplexBody.data.getOneComplex[0].roomkvsum)} so'm</Typography>
                    </CardContent>
                </Card>
    }

        function GetCompany() {
            const { _, __, data } = useQuery(GET_COMPANY);
            if(data) {
                return  data.company && data.company.map((e, index) => (
                      <MenuItem  key={index} value={e.id}>{e.name}</MenuItem>
                  )
                )
            }
        }
    

    const [getCompanyById, {error,data}] = useMutation(GET_COMPANY_BY_ID)
    const CompanyFn = e => {
        getCompanyById({
            variables:{
                id: e.target.value -0 
            }
        })
        if(error){
            window.location.reload(true)
        }
        setCompany(e.target.value); 
        setSelectDAta({company:{
            value: e.target.value-0,
            isSelected:true
        }});
        setRoom('')
        setComplex('')
        setDuration('')
    };
    const renderCompany = arr =>{
       return arr.map((e, index) =>(
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
        </Card>
        ))
    }

    const complexFn = e => {
        setComplex(e.target.value)
        setSelectDAta({
            company:{
                value: selectData.company.value,
                isSelected: selectData.company.isSelected
            },
            complex:{
                value: e.target.value-0,
                isSelected: true
            }
        });
        setRoom('');
        setDuration('')
    }

    const roomFn = e => {
        setRoom(e.target.value);
        setSelectDAta({
            company:{
                value: selectData.company.value,
                isSelected: selectData.company.isSelected
            },
            complex:{
                value: selectData.complex.value,
                isSelected: selectData.complex.isSelected
            },
            room:{
                value: e.target.value-0,
                isSelected:true
            }
        });
        setDuration('')
    }

    const durationFn = e => {
        setDuration(e.target.value);
        setSelectDAta({
            company:{
                value: selectData.company.value,
                isSelected: selectData.company.isSelected
            },
            complex:{
                value: selectData.complex.value,
                isSelected: selectData.complex.isSelected
            },
            room:{
                value: selectData.room.value,
                isSelected: selectData.room.isSelected
            },
            calculate:{
                value: e.target.value,
                isSelected: true
            }
        })
    }
    
    return (
        <div className="container">
            <Header text='Home' />


            <main className="main">
                <ol className="main__list">
                    <li className="main__list__item">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{MyContent[lang ? lang : defaultLang].companyLabel}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={company}
                                label={MyContent[lang ? lang :defaultLang].companyLabel}
                                onChange={CompanyFn}
                            >
                                {
                                    GetCompany()
                                }
                            </Select>
                        </FormControl>
                    </li>

                    <li className="main__list__item">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{MyContent[lang ? lang : defaultLang].complexLabel}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={complex}
                                label={MyContent[lang ? lang :defaultLang].complexLabel}
                                onChange={complexFn}
                            >
                                {
                                  selectData?.company?.isSelected &&  getComplexByCompanyIdBody.data &&  renderComplexOption(getComplexByCompanyIdBody.data.getComplex)
                                }
                            </Select>
                        </FormControl>
                    </li>

                    <li className="main__list__item">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{MyContent[lang ? lang : defaultLang].roomLabel}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={room}
                                label={MyContent[lang ? lang :defaultLang].roomLabel}
                                onChange={roomFn}
                            >
                                {
                                   selectData?.complex?.isSelected && getSelectedComplexBody.data && renderRoomOption(getSelectedComplexBody.data.getOneComplex[0].room)
                                }
                            </Select>
                        </FormControl>
                    </li>

                    <li className="main__list__item">
                        <FormControl disabled={selectData?.room?.isSelected ? false : true} fullWidth>
                            <InputLabel id="demo-simple-select-label">{MyContent[lang ? lang : defaultLang].durationLabel}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={duration}
                                label={MyContent[lang ? lang :defaultLang].durationLabel}
                                onChange={durationFn}
                            >
                                <MenuItem value="10">10</MenuItem>
                                <MenuItem value="15">15</MenuItem>
                                <MenuItem value="20">20</MenuItem>
                            </Select>
                        </FormControl>
                    </li>
                </ol>

                <div className="result__list">
                    <div>
                    {
                        data && renderCompany(data.getCompany)
                    }
                    </div>

                    <div>
                    {
                      selectData?.complex?.isSelected &&  getSelectedComplexBody.data && renderComplex(getSelectedComplexBody.data.getOneComplex)
                    }
                    </div>

                    <div>
                    {
                        selectData?.room?.isSelected && renderRoomValue(selectData?.room?.value)
                    }
                    </div>
                </div>

                <div className="result__list">
                    <div>
                        {
                            selectData?.calculate?.isSelected && found.data && renderFoundBank(found.data.findBank[0])
                        }
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Home;