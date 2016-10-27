export EDITOR="vim"
bindkey -v 

# vi style incremental search
bindkey '^R' history-incremental-search-backward
bindkey '^S' history-incremental-search-forward
bindkey '^P' history-search-backward
bindkey '^N' history-search-forward  

# If you want to move inside a directory in bash you would type cd foo, In zsh you can just type foo if you add this line to your .zshrc:
setopt AUTO_CD