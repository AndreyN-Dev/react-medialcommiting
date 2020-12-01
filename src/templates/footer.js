import React from "react";
import {withTranslation} from "react-i18next";
import footerLogo from "../assets/images/msd_logo_footer.png";

const Footer = (props) => {
    return (
        <div>
            <div className="text-center pt-3">
                Copyright © 2020 Merck Sharp & Dohme Corp., a subsidiary of Merck & Co., Inc., Kenilworth, NJ, USA. All
                rights reserved. AE-DIA-00030 EXP: 31-Dec-2020.<br/>
                In case you need any update or you have an inquiry or need to report an adverse reaction, you can
                contact<br/>
                Tel: <a href="tel:+97144269100">+9714 4269100</a> Fax: <a href="fax:+97144269204">+9714 4269204</a>
                Email: <a href="mailto:DPOC.GULF@MERCK.COM">DPOC.GULF@MERCK.COM</a>
            </div>
            <div className="justify-content-center d-flex mt-1">
                <img className="pb-3" src={footerLogo} alt="MSD Logo"/>
            </div>
        </div>
    );
}

export default withTranslation()(Footer);