import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className="py-6 flex justify-center align-center">
      <p>Copyright 2023 <span className="font-semibold"><Link href="https://github.com/Khareayushh">@khareayushh</Link></span></p>
    </div>
  )
}

export default Footer
