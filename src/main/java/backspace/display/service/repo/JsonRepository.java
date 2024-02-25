package backspace.display.service.repo;

import backspace.display.field.Identifiable;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.constraints.NotNull;
import lombok.extern.log4j.Log4j2;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@Log4j2
public abstract class JsonRepository<T extends Identifiable> implements Repository<T> {

    private final String storageFolderPath;
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private final Class<T> type;

    public JsonRepository(String storageFolderPath, Class<T> clazz) {
        this.storageFolderPath = storageFolderPath;
        this.type = clazz;
        new File(storageFolderPath).mkdirs();
    }

    @Override
    public List<T> getAll() {
        File[] files = new File(storageFolderPath).listFiles();
        List<T> objects = new ArrayList<>();
        if (files != null) {
            for (File file : files) {

                T object = getByFile(file, type);
                objects.add(object);
            }
        }
        return objects;
    }

    @Override
    public T add(T object) {
        if (object.getId() == null) {
            log.warn("Object {} with id is null", object.getClass().getSimpleName());
        }
        saveObjectToFile(object);
        return object;
    }

    @Override
    public void remove(T object) {
        if (object.getId() != null) {
            removeFileById(object.getId());
        } else {
            throw new NullPointerException("Cannot remove %s without id".formatted(object.getClass().getSimpleName()));
        }
    }

    @Override
    public void removeById(String id) {
        removeFileById(id);
    }


    @Override
    public void update(T oldT, T newT) {
        T old = getObjectFromFile(oldT);
        removeById(old.getId());
        add(newT);
    }

    @Override
    public T getById(String id) {
        return getObjectFromFileById(id, type);
    }


    protected T getObjectFromFile(T object) {
        Objects.requireNonNull(object.getId(), "Cannot read object without id");
        return getObjectFromFileById(object.getId(), (Class<T>) object.getClass());
    }

    protected T getObjectFromFileById(@NotNull String id, Class<T> clazz) {
        log.debug("Reading object from file by id: {}", id);
        return getByFile(getFileByObjectId(id), clazz);
    }

    private T getByFile(File file, Class<T> clazz) {
        try {
            return objectMapper.readValue(file, clazz);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    protected void saveObjectToFile(T object) {
        try {
            File targetFile = getFileByObjectId(object.getId());
            log.debug("{} {} with id {} to file: {}", targetFile.exists() ? "Updating" : "Saving",
                    object.getClass().getSimpleName(),
                    object.getId(), targetFile.getAbsoluteFile());
            objectMapper.writeValue(targetFile, object);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    protected void removeFileById(String id) {
        File file = getFileByObjectId(id);
        if (file.exists()) {
            boolean isRemoved = file.delete();
            if (!isRemoved) {
                throw new UncheckedIOException(new IOException("Cannot remove file: %s".formatted(file.getAbsolutePath())));
            }
        } else {
            throw new FileDoesNotExistException(file);
        }
    }

    protected void removeFile(T object) {
        Objects.requireNonNull(object.getId(), "Cannot remove object without id");
        removeFileById(object.getId());
    }



    private File getFileByObjectId(String id) {
        return Path.of(storageFolderPath, id + ".json").toFile();
    }


    private static class FileDoesNotExistException extends RuntimeException {
        public FileDoesNotExistException(File file) {
            super("File %s does not exist".formatted(file.getAbsolutePath()));
        }
    }
}
