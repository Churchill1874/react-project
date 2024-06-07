import { Route, Routes } from "react-router-dom";
import routes from "./routers/routers";

const App = () => {
    return (
        <div>
            <Routes>
                {
                    routes.map((route, index)=>(
                        <Route key={index} path={route.path} element={<route.component />}></Route>
                    ))
                }
            </Routes>
        </div>
    )
}
export default App;