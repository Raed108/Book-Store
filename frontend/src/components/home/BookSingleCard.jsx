/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import {Link} from 'react-router-dom'
import { PiBookOpenTextLight } from 'react-icons/pi'
import { BiUserCircle , BiShow } from 'react-icons/bi'
import { AiOutlineEdit } from 'react-icons/ai'
import { BsInfoCircle } from 'react-icons/bs'
import { MdOutlineDelete } from 'react-icons/md'
import { useState } from "react";
import BookModal from "./BookModal";

const BookSingleCard = ({book}) => {
    const [showModel, setShowModel] = useState(false)
  return (
    <div key={book._id} className='border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover:shadow-xl bg-white '>
                <h2 className='absolute top-1 right-2 px-4 py-1 bg-red-300 rounded-lg'>
                    {book.publishYear}
                </h2>
                {/* <h4 className='my-2 text-gray-400'>{book._id}</h4> */}
                <div className='flex justify-start items-center gap-x-2'>
                    <PiBookOpenTextLight className='text-2xl text-red-300'/>
                    <h2 className='my-1'>{book.title}</h2>
                </div>
                <div className='flex justify-start items-center gap-x-2'>
                    <BiUserCircle className='text-2xl text-red-300'/>
                    <h2 className='my-1'>{book.author}</h2>
                </div>
                <div className='flex justify-between items-center gap-x-2 mt-4 p-4'>
                    <BiShow className='text-blue-800 text-3xl hover:text-black cursor-pointer hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out' title='Show' onClick={() => setShowModel(true)}/>
                    <Link to={`/books/details/${book._id}`}>
                        <BsInfoCircle className='text-green-800 text-2xl hover:text-black hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out' title='Details'/>
                    </Link>
                    <Link to={`/books/edit/${book._id}`}>
                        <AiOutlineEdit className='text-yellow-600 text-2xl hover:text-black hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out' title='Edit'/>
                    </Link>
                    <Link to={`/books/delete/${book._id}`}>
                        <MdOutlineDelete className='text-red-600 text-2xl hover:text-black hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out' title='Delete'/>
                    </Link>
                </div>
                {showModel && <BookModal book={book} onClose={() => setShowModel(false)}/>}
             </div>
  )
}

export default BookSingleCard