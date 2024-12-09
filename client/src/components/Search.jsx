import React from 'react'
import { IoSearchOutline } from "react-icons/io5";
import { TypeAnimation } from 'react-type-animation';


const Search = () => {
  return (
    <div className=' w-full min-w-[300px] lg:min-w-[420px] h-12 rounded-lg border overflow-hidden flex items-center  text-neutral-500'>
            <button className=' flex justify-center items-center h-full p-3 text-neutral-600'>
            <IoSearchOutline size ={22} />
            </button>

                        <div>
                        <TypeAnimation
                        sequence={[
                            // Same substring at the start will only be typed out once, initially
                            'Search "milk',
                            1000, // wait 1s before replacing "Mice" with "Hamsters"
                            'Search "curd"',
                            1000,
                            'Search "paneer"',
                            1000,
                            'Search "sugar"', 
                            1000,
                            'Search "chocklate"',
                            1000,
                            'Search "sweets"',
                            1000,
                            'Search "cake"', 
                            1000,
                            'Search "egg"',
                            1000,
                            'Search "rice"',
                            1000,
                            'Search "chips"', 
                            1000
                        ]}
                        wrapper="span"
                        speed={50}
                        repeat={Infinity}
                />
                        </div>
    </div>
  )
}

export default Search