#! /data/data/com.termux/files/usr/bin/python2.x
# Auto report facebook v1.1: https://github.com/zevtyardt


#
# jangan report fb gw, gak kasian apa:(
# susah susah bikin ehh direport kan lucu
#
# jangan disebarin, ini private tools. jadi buat lu aja
#
# mau requests tools CLI lain? PM me :)
#
# tolong, hargai author :)
#


from __future__ import print_function
import time
import sys
import mechanize
import cookielib

# global variable
__version__ = '1.1'
__author__ = 'val (zevtyardt)'
__email__ = 'xnver404[at]gmail[dot]com'
tampil = lambda s,info='info': print('\r [%s] [%s] %s' % (time.strftime("%H:%M:%S"),info.upper(),s))
user_input = lambda s: raw_input('\r [%s] [INPUT] %s' %(time.strftime("%H:%M:%S"),s))

class zevrp:
    def __init__(self):
        begin()
        self.file = file
        self.user = user
        self.url = 'https://mbasic.facebook.com/'
        self.UserAgent = [('User-agent', 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.1) Gecko/2008071615 Fedora/3.0.1-1.fc9 Firefox/3.0.1')]
        self.account = self.parse_account()
        self._is_page = True

        for i in range(0,len(self.account)):
            self.br = self.setup()
            if self.login(self.account[i]['user'],self.account[i]['pwd']) == True:
                if self.open_target() == True:
                    if self._is_page == False:
                        self.reporting_id()
            print ('') # new line

        tampil('%s\n' % time.strftime('%c'),'completed')

    def setup(self):
        br = mechanize.Browser()
        cookie = cookielib.LWPCookieJar()
        br.set_handle_robots(False)
        br.set_handle_equiv(True)
        br.set_handle_referer(True)
        br.set_handle_redirect(True)
        br.set_cookiejar(cookie)
        br.set_handle_refresh(mechanize._http.HTTPRefreshProcessor(), max_time = 5)
        br.addheaders = self.UserAgent
        br.open(self.url)

        return br

    def parse_account(self):
        account = list()

        for i in open(self.file,'r').readlines():
            if i.strip() != '':
                splt = i.strip().split(':')
                try:
                    account.append({'user':splt[0], 'pwd':splt[1]})
                except IndexError: pass
        return account

    def login(self,user,pwd):
        tampil('Username >> %s' % user)
        tampil('Please wait, is logged into facebook')

        self.br.select_form(nr = 0)
        self.br.form['email'] = user
        self.br.form['pass'] = pwd
        self.br.submit()
        self.br.select_form(nr = 0)
        self.br.submit()

        if 'checkpoint' in self.br.geturl() or 'recovery' in self.br.geturl():
            tampil('%s >> Checkpoint' % user,'warn')
            return False

        else:
            if 'login' not in self.br.geturl():
                for i in self.br.links():
                    if 'Keluar' in i.text:
                        self.username = i.text.replace('Keluar (','')[:-1]
                        self.exit_link = i.url
                tampil('welcome %s' % self.username)
                return True
            else:
                tampil('Login failed','error')
                return False

    def open_target(self):

        self.br.open(self.url + self.user)

        for i in self.br.links():
           # check whether the target is a personal account or a page.
           if i.text == 'Blokir orang ini':
               self._is_page = False
           if i.text in ['Kembali ke Beranda','Buka Beranda']:
              tampil('Target not found','error')
              return False

        if self._is_page == True:
            print ('') # new line
            tampil('self._is_page == True','oppss')
            tampil('sorry we can\'t report other than personal account','oppss')
            tampil('please contact author !!\n','oppss')
            exit()

        tampil(self.br.geturl())
        return True

    def reporting_id(self):
        tampil('resolving..')
        self.br.open(self.url + self.br.find_link('Laporkan').url)

        tampil('report this profile')
        self.br.select_form(nr = 0)
        self.br.form['answer'] = ['account']
        self.br.submit()

        tampil('this is a fake account')
        self.br.select_form(nr=0)
        self.br.form['answer'] = ['fake']
        self.br.submit()

        tampil('send it to facebook for review')
        try:
                self.br.select_form(nr = 0)
                self.br.form [ 'action_key' ] = [ 'REPORT_CONTENT' ]
                self.br.submit()

                tampil('you have submitted the report','done')
                self.br.select_form(nr = 0)
                self.br.open(self.br.click(type = "submit", nr = 1))
                self.exit_account()
        except:
                tampil('could not find send button','warn')
                self.exit_account()

    def exit_account(self):
        tampil('change to another account','exit')

        self.br.open(self.url + self.exit_link)
        self.br.open(self.br.find_link('Login ke Akun Lain').url)

def begin():
    print ('') # new line
    tampil('Begin Execution: %s' % time.strftime("%c"))
    tampil('Target username: %s' % user)
    tampil('File account: %s' % file)
    print ('') # new line

if __name__ == '__main__':
    print ('Auto Report Facebook v%s: https://github.com/zevtyardt\n' % __version__)
    try:
        while 1:
            user = user_input('username target: ')
            file = user_input('file account list: ')
            if user and file:
                break
        zevrp()
    except KeyboardInterrupt: tampil('signal Interrupt caught..\n','exit')
    except Exception as e: tampil('%s\n Aborting..\n' % e,'error')
