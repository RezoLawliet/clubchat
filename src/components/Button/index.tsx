import React from 'react'

import cn from 'classnames'

import { FiPlus } from 'react-icons/fi'
import { GrFormNextLink } from 'react-icons/gr'
import { MdOutlineExitToApp } from 'react-icons/md'
import { AiOutlineLoading } from 'react-icons/ai'

import styles from './style.module.scss'

const icons = {
  next: <GrFormNextLink className={styles.icon} />,
  plus: <FiPlus className={styles.icon} />,
  exit: <MdOutlineExitToApp className={styles.icon} />,
  load: <AiOutlineLoading className={styles.load} />,
}

const colors = {
  blue: styles.blue,
  green: styles.green,
  red: styles.red,
  white: styles.white,
  transparent: styles.transparent,
  bordered: styles.bordered,
}

interface IButton {
  children?: string
  icon?: keyof typeof icons
  color?: keyof typeof colors
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const Button: React.FC<IButton> = ({ children, icon, color, disabled, onClick }) => {
  return (
    <button
      className={cn(color && color in colors ? colors[color] : colors.blue, {
        [styles.disabled]: disabled,
      })}
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
      {icon && icon in icons && icons[icon]}
    </button>
  )
}
