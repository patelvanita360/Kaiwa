import update = require('react-addons-update');
import * as Redux from 'redux';

import {readSession} from '../storage/localStorage';
import {IAction, ISessionAction} from './Actions';

import Action = Redux.Action;

export interface ISession {
    jid: string;
    password: string;
    connURL?: string;
    wsURL?: string;
    boshURL?: string;
    transport?: string;
}

function getDefaultSession() {
    const {wss} = KAIWA_CONFIG;
    const session: ISession = {
        connURL: wss,
        jid: '',
        password: ''
    };
    if (wss && wss.indexOf('http') === 0) {
        session.boshURL = wss;
        session.transport = 'bosh';
    } else if (wss.indexOf('ws') === 0) {
        session.wsURL = wss;
        session.transport = 'websocket';
    }

    return session;
}

export function reducer(state: ISession, action: IAction): ISession {
    if (state === undefined) {
        return readSession() || getDefaultSession();
    }

    switch (action.type) {
        case 'CONNECTING':
            let {session} = action as ISessionAction;
            if (KAIWA_CONFIG.domain && session.jid.indexOf('@') === -1) {
                const jid = `${session.jid}@${KAIWA_CONFIG.domain}`;
                session = update(session, {jid: {$set: jid}});
            }

            return session;
    }

    return state;
}
