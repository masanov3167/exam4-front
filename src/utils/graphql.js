import { gql } from "@apollo/client"

const DELETE_COMPLEX = gql`
mutation delComplex($id: ID!){
  delComplex(id:$id)
}`

const DELETE_COMPANY = gql`
mutation delCompany($id: ID){
delCompany(id: $id)
}`

const DELETE_BANK = gql`mutation delBank($id:ID!){
    delBank(id:$id)
}`

const POST_COMPLEX = gql`
mutation postComplex($name:String,$address:String,  $room:Int, $roomkv:Int, $roomkvsum:Int, $companyid: Int){
  postComplex(name: $name,address:$address,  room:$room, roomkv:$roomkv, roomkvsum:$roomkvsum, companyid: $companyid)
}`

const POST_BANK = gql`mutation postBank($name:String, $address: String, $mortgage:mortgage){
    postBank(name: $name, address:$address, mortgage:$mortgage)
  }`

const PUT_COMPLEX = gql`mutation putComplex($name:String,$address:String,  $room:Int, $roomkv:Int, $roomkvsum:Int, $companyid: Int, $id: ID!){
    putComplex(name: $name, address: $address, room: $room, roomkv: $roomkv, roomkvsum: $roomkvsum, companyid:$companyid, id: $id)
}`

const PUT_BANK = gql`mutation putBAnk($name: String, $address:String, $mortgage: mortgage, $id:ID!){
    putBank(name: $name,address: $address,mortgage: $mortgage, id:$id)
  }`

const GET_COMPLEX = gql`query{
    complex{
      id
      name
      address
      room
      roomkv
      roomkvsum
      companyid
    }
  }`

  const GET_BANK = gql`query{
    bank{
      id
      name
      address
      mortgage
    }
  }`

  const GET_COMPANY = gql`query{
    company{
      id
      name
      img
    }
  }`

  const GET_COMPANY_BY_ID = gql`mutation getCompany($id:ID!){
    getCompany(id: $id){
      id
      name
      img
    }
  }`

  const GET_COMPLEX_BY_COMPANYID = gql`mutation getComplex($id: ID!){
    getComplex(id: $id){
      id
      name
    }
  }`

  const GET_ONE_COMPLEX = gql`mutation getOneComplex($id:ID!){
    getOneComplex(id: $id){
      id
      name
      address
      room
      roomkv
      roomkvsum
    }
  }`

  const FIND_BANK = gql`mutation findBank($year: Int, $sum: Int){
    findBank(year: $year, sum: $sum){
      id
      name
      address
      mortgage
    }
  }`

export {FIND_BANK, GET_ONE_COMPLEX,GET_COMPLEX_BY_COMPANYID, GET_COMPANY_BY_ID, DELETE_COMPLEX, DELETE_COMPANY, POST_COMPLEX, PUT_COMPLEX, GET_COMPLEX, POST_BANK, PUT_BANK, GET_BANK, GET_COMPANY, DELETE_BANK}