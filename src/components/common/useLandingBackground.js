import { useLayoutEffect } from 'react';

// Purple page background while a landing page is mounted
export default function useLandingBackground() {
	useLayoutEffect(() => {
		const previous = document.body.style.backgroundColor;
		document.body.style.backgroundColor = '#330c43';
		return () => {
			document.body.style.backgroundColor = previous;
		};
	}, []);
}
