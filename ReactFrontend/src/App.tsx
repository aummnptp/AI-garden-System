
import {Routes, Route,Link,NavLink} from 'react-router-dom'
import Home from './pages/Home';

function App() {

  return (
    <main>
        <Routes>
            <Route index element={<Home/>}/>
           
        </Routes>
    </main>
  )
}

export default App
