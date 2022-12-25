import { Outlet } from "react-router-dom";
import SideNavigation from "../components/SideNavigation";
import "../App.css"

const BaseScreen = () => {
    return ( 
        <div className="base-container md:h-screen">
            <div className="side-navigation md:h-screen">
                <SideNavigation/>
            </div>
            <div className="side-content">
                <Outlet/>
            </div>
        </div>
    );
}
 
export default BaseScreen;