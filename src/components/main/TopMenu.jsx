import { useState } from 'react';
import { useNavigate } from 'react-router';
import { inviteQuery } from '../../utils/params.js';
import './TopMenu.css';

function TopMenu({ invite }) {
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(true);

	return (
		<div id="top-menu" className={`top-menu ${collapsed ? 'collapsed' : ''}`}>
			{!collapsed && (
				<>
					<h3>Aquest joc va ser la nostra invitació de casament. Pots jugar-lo o anar directament a la invitació.</h3>
					<button onClick={() => navigate('/landing' + inviteQuery(invite.raw))}>VEURE LA INVITACIÓ</button>
				</>
			)}
			<div>
				<br/>
				<button className="collapse-button" onClick={() => setCollapsed(!collapsed)}>
					{collapsed ? 'VEURE LA INVITACIÓ' : 'Vull jugar'}
				</button>
			</div>
		</div>
	);
}

export default TopMenu;
