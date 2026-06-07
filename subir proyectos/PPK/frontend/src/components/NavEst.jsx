import logo from '../assets/imagen/logo.png'


const NavEst = () => {
  return (
    <nav className="navbar navbar-expand bg-white">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img
            src={logo}
            alt="Logo"
            width="50"
            height="50"
            className="d-inline-block aling-text-top"
          />
          Universidad de Las Tunas
          
        </a>
      </div>
    </nav>
  );
};

export default NavEst;
