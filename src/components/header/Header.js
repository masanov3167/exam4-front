import React, {useState, useContext} from "react"
import { Context } from "../../context/Context"
import './header.css'
import SelectMy from "react-select"



const Header = ({text}) =>{
    const {lang, setLang,defaultLang } = useContext(Context);
    const [arr] = useState([
        {
            label:"uz",
            value:"uz"
        },
        {
            label:"ru",
            value:"ru"
        },
        {
            label:'en',
            value:'en'
        }
    ])

    
    const test = e =>{
        setLang(e.value)
    }
    return (
        <header className="header">
            <ol className="header__list">
                <a className="header__text" href="/">OLX.UZ</a>
                <h5 className="header__link" onClick={() => window.location.href = text==='Admin' ? '/' : '/admin'}>{text === 'Admin' ? 'Home' : 'Admin'} &#128279;</h5>
                {
                    text === 'Admin' ? (
                        ''
                    ): (
                        <SelectMy  defaultValue={arr.find(a => a.value === (lang ? lang : defaultLang))} options={arr} isLoading='true' onChange={test} className='header__select' />
                    )
                }
            </ol>
        </header>
    )
}

export default Header;


