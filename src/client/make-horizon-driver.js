export default function makeHorizonDriver() {
	return function horizonDriver(writeOps$$) {
		writeOps$$.switch().subscribe()
		return Horizon({
			authType: 'anonymous',
			lazyWrites: true
		})
	}
}
