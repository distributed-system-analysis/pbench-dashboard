Name:           {{{ git_name name=pbench-dashboard }}}
Version:        {{{ git_version lead=3.1 }}}
Release:        1
Summary:        The pbench dashboard bits

License:        GPLv3+
URL:            http://github.com/distributed-systems-analysis/pbench-dashboard
Source0:        {{{ git_dir_pack }}}
Buildarch:      noarch


BuildRequires: yarn nodejs

%define installdir var/www/html/dashboard

%description
The pbench "dashboard" UI

%prep

{{{ git_dir_setup_macro }}}

%build
yarn install
yarn build

%pre
getent group pbench > /dev/null || groupadd pbench
getent passwd pbench > /dev/null || useradd -g pbench -d /home/pbench -c "Pbench user" pbench

%install
rm -rf %{buildroot}
mkdir -p %{buildroot}/%{installdir}
cp -a ./dist/* %{buildroot}/%{installdir}

%post

%preun

%postun

%posttrans

%files
%defattr(644, pbench, pbench, 755)
/%{installdir}
