S="cc"

tmux new-session -s $S -d -n nvim
tmux send-keys -t $S:nvim 'nvim' Enter

tmux new-window -t $S -d -n commands

tmux new-window -t $S -n run
tmux send-keys -t $S:run 'pnpm dev' Enter

tmux new-window -t $S -n docker
tmux send-keys -t $S:docker 'dc -f docker-compose.dev.yml up' Enter

tmux attach-session -t $S
