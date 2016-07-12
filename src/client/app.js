import get from 'lodash/fp/get'
import Rx from 'rxjs/Rx'
import {run} from '@cycle/rxjs-run'
import {div, label, input, h1, form, makeDOMDriver} from '@cycle/dom'

import makeHorizonDriver from './make-horizon-driver'

const main = (sources) => ({
	DOM: view({DOM: sources.DOM}),
})

function view({DOM}) {
	const signIn = SignIn({DOM})
	const name$ = signIn.value
	const chooseGame = ChooseGame({DOM, name$})
	const page$ = signIn.submitted.map(submitted =>
		submitted ? 'CHOOSE_GAME' : 'SIGN_IN'
	)

	return page$
		.combineLatest(signIn.DOM, chooseGame.DOM)
		.map(([page, signInVTree, chooseGameVTree]) =>
			page === 'SIGN_IN'
				? signInVTree
				: chooseGameVTree
		)
}

function ChooseGame({DOM, name$}) {
	const vtree$ = name$.map(name => div(`Hello ${name}!`))
	return {
		DOM: vtree$,
	}
}

function SignIn({DOM}) {
	const value$ = DOM.select('.name').events('input')
		.map(get('target.value'))
		.startWith('')
	const submitted$ = DOM.select('form').events('submit')
		.do(event => event.preventDefault())
		.map(() => true)
		.startWith(false)
		.take(2)

	const vtree$ = value$.map((value) =>
		form([
			label('Name:'),
			input('.name', {props: {type: 'text', value}}),
			input({props: {type: 'submit'}}),
		])
	)

	return {
		DOM: vtree$,
		value: value$,
		submitted: submitted$,
	}
}

const drivers = {
	DOM: makeDOMDriver('#app-container'),
	horizon: makeHorizonDriver(),
}

run(main, drivers)
