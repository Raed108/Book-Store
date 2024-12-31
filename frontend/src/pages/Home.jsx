/* eslint-disable no-unused-vars */
import React,{useEffect,useState} from 'react'
import axios from 'axios'
import Spinner  from '../components/Spinner'
import { Link } from 'react-router-dom'
import { AiOutlineEdit } from 'react-icons/ai'
import { BsInfoCircle } from 'react-icons/bs'
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md'
import BooksTable from '../components/home/BooksTable'
import BooksCard from '../components/home/BooksCard'



export const Home = () => {
  const [books,setBooks] = useState([]);
  const [loading,setLoading] = useState(false);
  const [showType,setShowType] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(()=>{
    setLoading(true);
    axios.get('http://localhost:8000/books').then((res)=>{
        setBooks(res.data.data);
        setLoading(false);
    }).catch((err)=>{
        console.log(err);
        setLoading(false);
    })
  },[])

  // Function to filter books based on search input
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.publishYear.toString().includes(searchTerm)
  );

  return (
        <div className='p-4'>
          <div className='flex justify-center items-center gap-x-4 p-8'>
            <button className='py-1 px-4 bg-sky-300 rounded-lg hover:bg-sky-600 hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out' onClick={()=>setShowType('table')}>Table</button>
            <button className='py-1 px-4 bg-sky-300 rounded-lg hover:bg-sky-600 hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out' onClick={()=>setShowType('card')}>Card</button>
          </div>
          <input 
            type="text" 
            placeholder="Search by title, author, or publish year..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="mb-4 p-2 border border-slate-700 rounded-md w-[600px] mx-auto block"
          />
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl my-8'>Books List</h1>
            <Link to='/books/create'>
              <MdOutlineAddBox className='text-sky-800 text-4xl hover:text-black hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out' title='Create Book'/>
            </Link>
          </div>
          {loading ? (<Spinner />) : showType === 'table' ? (<BooksTable books={filteredBooks} />) : (<BooksCard books={filteredBooks} />)}
        </div>
  )
}

export default Home;