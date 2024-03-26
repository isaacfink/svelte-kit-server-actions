import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import {Chalk} from 'chalk'
import {plugin} from './src/plugin'

const chalk = new Chalk()

export default defineConfig({
	plugins: [
		plugin(),
		sveltekit()
	]
});
