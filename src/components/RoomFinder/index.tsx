import React from 'react'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { IoSearchSharp } from 'react-icons/io5'
import { MdClear } from 'react-icons/md'

import styles from './style.module.scss'

interface IRoomFinder {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

export const RoomFinder: React.FC<IRoomFinder> = ({ search, setSearch }) => {
  const [value, setValue] = React.useState('')

  return (
    <div className={styles.search}>
      <label htmlFor="search">
        <IoSearchSharp className={styles.icon} />
      </label>
      <input
        id="search"
        className={styles.searchbar}
        type="text"
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          setSearch(event.target.value)
        }}
        placeholder="Enter room's topic or uuid..."
        autoComplete="off"
        spellCheck="false"
      />
      {value && (
        <button
          className="outline-none"
          onClick={() => {
            setValue('')
            setSearch('')
          }}
        >
          <MdClear className="w-6 h-auto p-1" />
        </button>
      )}
    </div>
  )
}
