import { Typography } from "@mui/material";

export default function Footer() {

	return (
		<Typography
			variant="caption"
			display="block"
			textAlign="center"
			mt={4}
			color="text.secondary"
		>
			Built by Maxwell Lo ·{" "}
			<a
				href="https://github.com/lo-maxwell/ingredient-substitutor"
				target="_blank"
				rel="noopener noreferrer"
				style={{ color: "inherit", textDecoration: "underline" }}
			>
				View source on GitHub
			</a>
		</Typography>
	)
}