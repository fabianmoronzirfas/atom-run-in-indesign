'use babel';

import RunInIndesignView from './run-in-indesign-view';
import { CompositeDisposable } from 'atom';
//import * as atom from 'atom';
import * as path from 'path';
import {exec} from 'child_process';


export default {

  runInIndesignView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.runInIndesignView = new RunInIndesignView(state.runInIndesignViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.runInIndesignView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'run-in-indesign:toggle': () => this.execute()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.runInIndesignView.destroy();
  },

  serialize() {
    return {
      runInIndesignViewState: this.runInIndesignView.serialize()
    };
  },
  execute(){
    let applescriptPath = path.resolve(__dirname, '../bin/run_idscript_CC_2015.scpt');
    let editor = atom.workspace.getActivePaneItem();
    let file = editor.buffer.file;
    let filePath = null;
    if(file !== null){
      filePath = file.path;
    }
    atom.notifications.addInfo(filePath);

    exec(`osascript ${applescriptPath} ${filePath}`,(error, stdout, stderr)=>{
      if(error){
        atom.notifications.addError(error);
      }else{
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      }
    });

  },
  toggle() {
    console.log('RunInIndesign was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
