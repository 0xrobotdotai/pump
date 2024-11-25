import { Button } from '@nextui-org/button'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='h-full flex flex-col justify-center'>
      <div>
        <p className='text-[8rem] text-white/40'>404</p>
      </div>
      <Button as={Link} href="/" color='primary' className='text-white/90 opacity-85'>Go Home</Button>
    </div>
  )
}