import get from 'lodash/fp/get'
import xs from 'xstream'
import {run} from '@cycle/rxjs-run'
import {div, label, input, hr, h1, makeDOMDriver} from '@cycle/dom'

function intent(sources) {
	const horizonCollection = sources.horizon('testing_text')
	const inputChange$ = sources.DOM.select('.field').events('input')
		.map(get('target.value'))
	const writeOps$$ = inputChange$.map(text =>
		horizonCollection.store({
			datetime: new Date(),
			text,
		})
	)
	const name$ = horizonCollection
		.order('datetime', 'descending')
		.limit(1)
		.watch()
		.map(get('0.text'))

	return {
		writeOps$$,
		name$,
	}
}

function model(name$) {
	return name$
		.map(name => ({ name }))
}

function view(state$) {
	return state$.map(({ name }) =>
		div([
			label('Name:'),
			input('.field', {type: 'text', value: name}),
			hr(),
			h1(`Hello ${name || ''}`),
		])
	)
}

function main(sources) {
	const intents = intent(sources)
	const state$ = model(intents.name$)
	const sinks = {
		DOM: view(state$),
		horizon: intents.writeOps$$,
	}

	return sinks
}

const drivers = {
	DOM: makeDOMDriver('#app-container'),
	horizon: makeHorizonDriver(),
}

function makeHorizonDriver() {
	return function horizonDriver(writeOps$$) {
		writeOps$$.switch().subscribe()
		return Horizon({ lazyWrites: true })
	}
}

run(main, drivers)
