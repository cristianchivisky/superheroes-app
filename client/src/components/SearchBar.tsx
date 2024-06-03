'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SearchBar() {
    const [inputText, setInputText] = useState('')
    const router = useRouter()
   
    function handleSubmit() {
        if (!inputText) return
        router.push(`/search/${inputText}`)
    }

    return (
        <form
            className="order-2 flex h-[40px] w-full items-center rounded-3xl border-2 border-black bg-white px-2 md:order-none md:w-[30rem]"
            onSubmit={e => {
                e.preventDefault()
                handleSubmit()
            }}
        >
            <Image width={40} height={42} className="px-3 py-3" alt="search" src="/SearchIcon.svg" />
            <input
                className="h-max w-full rounded-r-3xl bg-white text-base placeholder-neutral-400 outline-none "
                type="text"
                onChange={e => setInputText(e.target.value)}
                placeholder="Search"
            />
        </form>
    )
}