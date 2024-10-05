import { RouterProvider } from 'react-router-dom'
import router from '@/routers'

function Root() {
    return <RouterProvider router={router} />
}

export default Root
