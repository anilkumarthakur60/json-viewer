import { mount } from 'svelte'
import App from './App.svelte'
import '@anil-labs/json-viewer-core/styles.css'
import './style.css'

mount(App, { target: document.getElementById('app')! })
