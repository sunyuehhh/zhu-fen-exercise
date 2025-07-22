import {Link,useRoutes} from 'react-router-dom'
import routesConfig from './routesConfig'

export default ()=>{
  return (
    <>
    <ul>
      <li>
        <Link to="/">首页</Link>
      </li>
      <li>
        <Link to="/user">用户管理</Link>
      </li>
      <li>
        <Link to="/profile">个人中心</Link>
      </li>
    </ul>
    {useRoutes(routesConfig)}
    </>
  )
}