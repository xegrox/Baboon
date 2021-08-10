<template>
  <Navbar active='FAQ'/>
  <div class="bg-gray-800 h-96 w-full flex flex-col items-center justify-center shadow-2xl text-gray-200 gap-10">
    <p class="text-3xl font-mono">Frequently Asked Questions</p>
    <div class="bg-gray-700 rounded-full w-96 py-4 px-5 flex items-center gap-5">
      <SearchIcon/>
      <input v-model="filter" class="flex-1 bg-transparent outline-none"/>
    </div>
  </div>
  <div class="flex flex-col items-center py-14">
    <div class="flex flex-col w-2/3">
      <Entry v-for="(entry, index) in filteredList" :key="entry.title" :class="{ 'border-t border-gray-600': index > 0 }" :title="entry.title" :contents="entry.contents"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import Navbar from './Navbar.vue'
import Entry from './FAQEntry.vue'
import { SearchIcon } from '@zhuowenli/vue-feather-icons'

interface Entry {
  title: string,
  contents: string
}

export default defineComponent({
  components: {
    Navbar,
    SearchIcon,
    Entry
  },
  setup() {
    let entries = new Array<Entry>()
    entries.push({
      title: 'What is SFTP?',
      contents: `
**Secure File Transfer Protocol (SFTP)** is a more secure option than FTP, by working over SSH to establish a secure connection.
It allows files to be transferred securely over a network, using encryption algorithms to prevent outsiders from reading or interfering with the transferred data.
&nbsp;
Baboon establishes a SFTP connection to your workspace in order to read, write and delete files in your projects.
No data is stored on our server side, and the SFTP connection dropped once you leave the app.
      `
    })
    entries.push({
      title: 'How do I start an SFTP server?',
      contents: `
# Linux
&nbsp;
## Installing SSH Daemon
&nbsp;
First, install the SSH Daemon with your package manager. It should usually come preinstalled.
&nbsp;
~~~shell
$ sudo apt install ssh
~~~
&nbsp;
## Creating an SFTP group and user
&nbsp;
It is *highly recommended* that you do so to sandbox your environment, so that an intruder would not be able to gain access to your entire filesystem should your login be compromised
&nbsp;
~~~shell
$ sudo groupadd sftp_users
$ sudo useradd -m -g sftp_users -s /sbin/nologin sftp_user
~~~
&nbsp;
The \`-m\` flag creates a home directory at \`/home/sftp_user\`
The \`-g\` flag assigns your user to the given group
The \`-s\` flag sets the user's shell. We set it to \`/sbin/nologin\` such that the user cannot be logged in from a shell. We only want the user to be logged in via SFTP
Then, set a password for your sftp user. This is the same password used to login to the sftp connection
&nbsp;
\`sudo passwd sftp_user\`
&nbsp;
## Configuring the SSH Daemon
&nbsp;
Open the configuration file with your favourite editor
&nbsp;
~~~shell
$ sudo vi /etc/ssh/sshd_config
~~~
&nbsp;
Add the following lines to the end of the file
&nbsp;
~~~
Match Group sftp_users
  ChrootDirectory /home/%u
  ForceCommand internal-sftp
~~~
&nbsp;
This sets the root directory of any sftp user to \`/home/<username>\`, and disallows SSH connections (SFTP still works)
&nbsp;
## Starting the connection
&nbsp;
Just run
&nbsp;
~~~shell
$ sudo systemctl start sshd
~~~
&nbsp;
and you'll be good to go
You can now login to your SSH server via the app's login page
*The default port number is 22*
`
    })
    entries.push({
      title: 'What is LSP?',
      contents: `
**Language Server Protocol (LSP)** is a protocol that allows code editors to fetch _code diagnostics_, and provide features such as _auto complete_, _go to defination_, and many more
It is often used by IDEs such as VSCode, Atom and Eclipse etc
Most languages provide their own LSP implementation, with over 100 of them available
`
    })
    entries.push({
      title: 'How can I use an LSP server?',
      contents: `
## Search for an LSP server implementation
&nbsp;
Find an LSP server for the language you want to code in
There are many of them available, just to list a few:
&nbsp;

| Language    | Repository
| ----------- | ---------
| Typescript  | [typescript-language-server](https://github.com/theia-ide/typescript-language-server)
| Kotlin      | [kotlin-language-server](https://github.com/fwcd/kotlin-language-server)
| Rust        | [rls](https://github.com/rust-lang/rls)

&nbsp;
## Proxy the LSP over WebSocket
&nbsp;
After building and obtaining the LSP executable, we have to make it available to communicate with the app.
This is done so by proxying it over WebSocket, which the app can then receive and send requests from.
&nbsp;
First, build and obtain the binary from [https://github.com/qualified/lsp-ws-proxy](https://github.com/qualified/lsp-ws-proxy)
It provides a quick and easy program that does the job
*Make sure to [install rust](https://doc.rust-lang.org/cargo/getting-started/installation.html) first*
&nbsp;
~~~shell
$ git clone https://github.com/qualified/lsp-ws-proxy
$ cd lsp-ws-proxy
$ cargo build release
~~~
&nbsp;
The binary is now located at \`target/release/lsp-ws-proxy\'
&nbsp;
## Run the proxy and LSP server
&nbsp;
Find out the command for your LSP server to listen from stdio
For an instance, the command for \`typescript-language-server\` is:
&nbsp;
~~~shell
$ typescript-language-server --stdio
~~~
&nbsp;
It may differ from other LSP servers
&nbsp;
Next, copy and insert the command above below
&nbsp;
~~~shell
$ ./lsp-ws-proxy -- <insert command here> # ./lsp-ws-proxy -- typescript-language-server
~~~
&nbsp;
This will redirect all WebSocket requests to stdio, and vice versa
By default, the WebSocket server will run on port \`9999\`
You can change it with the \`-l\` flag
&nbsp;
~~~shell
$ ./lsp-ws-proxy -l 9998 <insert command here>
~~~
&nbsp;
That's it!
Now you can connect to your server from the app
`
    })
    entries.push({
      title: 'Why are my imports not resolved?',
      contents: `
## Your LSP server might be running on a different root path than your SFTP server.
&nbsp;
When the app sends requests to your LSP server, it sends the absolute path of your files from your SFTP server
If your LSP server has a different root path, it would not be able to obtain imports from the said path, since they do not exist there
&nbsp;
To fix this, configure \`Settings > Path Prefix\` of your LSP server in the app
Enter the root path of your SFTP server **relative** to the root path of your LSP server
&nbsp;
For an instance, if the **root path of your LSP server** is
&nbsp;
~~~
/
~~~
&nbsp;
and the **root path of your SFTP server** is
&nbsp;
~~~
/home/sftp_user
~~~
&nbsp;
Then \`Path Prefix\` should be
&nbsp;
~~~
/home/sftp_user
~~~
&nbsp;
This will point the LSP server to look for imports at the correct paths
`
    })
    entries.push({
      title: 'Why is my LSP server checking all my files? I only want it to check certain files',
      contents: `
## The app is unable to identify what language your LSP server is serving
&nbsp;
Hence by default, the app sends all opened files for checking (linting)
&nbsp;
To fix this, specify a regex in \`Settings > File Match\`, to match the filenames of files that should be checked
&nbsp;
For an instance, if you want to target \`javascript\` files, the regex would be
&nbsp;
~~~
\\.(t|j)sx?$
~~~
&nbsp;
This matches filenames ending with \`.js\`, \`.ts\`, \`.jsx\` and \`.ts\`, and limits the LSP to only check those files
`
    })
    let filter = ref('')
    return {
      filter,
      filteredList: computed(() => {
        return entries.filter(({ title }) => title.toLowerCase().includes(filter.value.toLowerCase()))
      })
    }
  }
})
</script>

<style lang="postcss">
html {
  @apply bg-gray-800
}
</style>
