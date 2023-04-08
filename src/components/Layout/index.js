import Navigation from "../Navigation"
const Layout = ({ children, title, subTitle }) => {
    return (
      <div>
        <Navigation  />
        <div>
            {title}-{subTitle}
        </div>
        <div style={{ width: "85%", margin: "0 auto" }}>{children}</div>
      </div>
    )
  }
  
  export default Layout