import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from '@react-spring/web';
import './Landing.css';

// Full-height block that fades in the first time it scrolls into view
export function Section({ children, style }) {
	const [ref, inView] = useInView({ triggerOnce: true });
	const springStyle = useSpring({
		delay: inView ? 200 : 0,
		opacity: inView ? 1 : 0,
		config: { duration: 1200 },
	});

	return (
		<animated.div ref={ref} style={{ ...springStyle, ...style }}>
			{children}
		</animated.div>
	);
}

export function Footer() {
	return (
		<Section>
			<div className="section">
				<p><i>@Xavier Miranda Sánchez @Miriam Garcia Sala</i></p>
				<p><i>Tots els drets reservats - {new Date().getFullYear()}</i></p>
			</div>
		</Section>
	);
}
